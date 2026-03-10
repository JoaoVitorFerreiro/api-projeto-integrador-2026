export class Cliente {
  private constructor(
    private id: number,
    private nome: string,
    private email: string
  ) {}

  static create(nome: string, email: string): Cliente {
    if (!nome || nome.trim().length === 0) {
      throw new Error("Nome é obrigatório");
    }
    if (!email || !email.includes("@")) {
      throw new Error("Email inválido");
    }
    return new Cliente(0, nome.trim(), email.trim());
  }

  static reconstituir(id: number, nome: string, email: string): Cliente {
    return new Cliente(id, nome, email);
  }

  getId(): number {
    return this.id;
  }
  getNome(): string {
    return this.nome;
  }
  getEmail(): string {
    return this.email;
  }
}
