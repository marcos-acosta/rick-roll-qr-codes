import type * as Party from "partykit/server";

// This is the server that runs on PartyKit's edge infrastructure
// Each room gets its own instance of this class
export default class Server implements Party.Server {
  // Room state - stored in memory for this room
  count: number = 0;
  creator: string | null = null;

  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    console.log(`Connected: ${conn.id} to room ${this.room.id}`);

    // If this is the first connection, they become the creator
    if (this.creator === null) {
      this.creator = conn.id;
      conn.send(JSON.stringify({ type: "role", role: "creator" }));
    } else {
      conn.send(JSON.stringify({ type: "role", role: "joiner" }));
    }

    // Send current count to the new connection
    conn.send(JSON.stringify({ type: "count", count: this.count }));
  }

  onMessage(message: string, sender: Party.Connection) {
    const data = JSON.parse(message);

    // Handle increment message
    if (data.type === "increment") {
      this.count++;
      // Broadcast new count to ALL connections in the room
      this.room.broadcast(
        JSON.stringify({ type: "count", count: this.count })
      );
    }
  }
}

Server satisfies Party.Worker;
