export class User {
  constructor(
    public readonly id: string | null,
    public name: string,
    public email: string,
    public role: string = "user",
    public isOnboarded: boolean = false,
    public createdAt: Date = new Date(),
    public updatedAt: Date | null,
    public deletedAt: Date | null,
  ) { }
}
