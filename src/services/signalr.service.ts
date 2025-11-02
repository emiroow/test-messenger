import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { SIGNALR_CONFIG } from "../config/api.config";

class SignalRService {
  private connection: HubConnection | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor() {
    this.initialize();
  }

  private initialize() {
    const userId = localStorage.getItem("userId");

    this.connection = new HubConnectionBuilder()
      .withUrl(SIGNALR_CONFIG.hubUrl, {
        accessTokenFactory: () => userId || "",
      })
      .withAutomaticReconnect(SIGNALR_CONFIG.reconnectDelays)
      .configureLogging(LogLevel.Information)
      .build();

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    if (!this.connection) return;

    this.connection.onreconnecting((error) => {
      console.warn("[SignalR] Reconnecting...", error);
      this.reconnectAttempts++;
    });

    this.connection.onreconnected((connectionId) => {
      console.log("[SignalR] Reconnected!", connectionId);
      this.reconnectAttempts = 0;
    });

    this.connection.onclose((error) => {
      console.error("[SignalR] Connection closed", error);

      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => this.start(), 5000);
      }
    });
  }

  async start(): Promise<void> {
    if (!this.connection) {
      this.initialize();
    }

    if (this.connection?.state === HubConnectionState.Disconnected) {
      try {
        await this.connection.start();
        console.log("[SignalR] Connected successfully");
      } catch (error) {
        console.error("[SignalR] Connection failed:", error);
        throw error;
      }
    }
  }

  async stop(): Promise<void> {
    if (
      this.connection &&
      this.connection.state !== HubConnectionState.Disconnected
    ) {
      try {
        await this.connection.stop();
        console.log("[SignalR] Disconnected");
      } catch (error) {
        console.error("[SignalR] Disconnection failed:", error);
      }
    }
  }

  // Subscribe to hub methods
  on(methodName: string, callback: (...args: any[]) => void): void {
    if (!this.connection) {
      console.error("[SignalR] Connection not initialized");
      return;
    }
    this.connection.on(methodName, callback);
  }

  // Unsubscribe from hub methods
  off(methodName: string, callback?: (...args: any[]) => void): void {
    if (!this.connection) return;

    if (callback) {
      this.connection.off(methodName, callback);
    } else {
      this.connection.off(methodName);
    }
  }

  // Invoke hub methods
  async invoke<T = any>(methodName: string, ...args: any[]): Promise<T> {
    if (!this.connection) {
      throw new Error("[SignalR] Connection not initialized");
    }

    if (this.connection.state !== HubConnectionState.Connected) {
      await this.start();
    }

    try {
      return await this.connection.invoke<T>(methodName, ...args);
    } catch (error) {
      console.error(`[SignalR] Invoke '${methodName}' failed:`, error);
      throw error;
    }
  }

  // Send message (fire and forget)
  async send(methodName: string, ...args: any[]): Promise<void> {
    if (!this.connection) {
      throw new Error("[SignalR] Connection not initialized");
    }

    if (this.connection.state !== HubConnectionState.Connected) {
      await this.start();
    }

    try {
      await this.connection.send(methodName, ...args);
    } catch (error) {
      console.error(`[SignalR] Send '${methodName}' failed:`, error);
      throw error;
    }
  }

  // Get connection state
  getState(): HubConnectionState | null {
    return this.connection?.state || null;
  }

  // Check if connected
  isConnected(): boolean {
    return this.connection?.state === HubConnectionState.Connected;
  }

  // Restart connection with new user
  async restart(): Promise<void> {
    await this.stop();
    this.initialize();
    await this.start();
  }
}

// Export singleton instance
export const signalRService = new SignalRService();
export default signalRService;
