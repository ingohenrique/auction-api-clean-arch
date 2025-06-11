import pgp from "pg-promise";

export default interface DatabaseConnection {
  query(sql: string, params: any[]): Promise<any[]>;
  close(): Promise<void>;
}

export class PgPromiseAdapter implements DatabaseConnection {
  connection: any;

  constructor() {
    this.connection = pgp()(
      "postgres://postgres:postgres@localhost:5432/girao"
    );
  }

  async query(sql: string, params: any[]): Promise<any[]> {
    return this.connection.query(sql, params);
  }

  async close(): Promise<void> {
    return this.connection.$pool.end();
  }
}
