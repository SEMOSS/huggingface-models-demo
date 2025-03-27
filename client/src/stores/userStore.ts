import { makeAutoObservable, runInAction } from "mobx";
import { getUserInfo } from "../pixels/pixel-calls";

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
}

export class UserStore {
  user: User | null = null;
  isLoading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user: User) {
    this.user = user;
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  parseUserInfo(userInformation: Record<string, any>): User {
    const values = Object.values(userInformation);
    if (values.length === 1) {
      const info = values[0];
      return {
        id: info.id,
        name: info.name,
        email: info.email,
        username: info.username,
      };
    }
    throw new Error("Object does not have exactly one key-value pair");
  }

  async fetchUserInfo() {
    this.setLoading(true);
    this.setError(null);

    try {
      const userInfo = await getUserInfo();
      runInAction(() => {
        const parsedUser = this.parseUserInfo(userInfo as Record<string, any>);
        this.setUser(parsedUser);
        this.setLoading(false);
      });
    } catch (error) {
      runInAction(() => {
        this.setError(
          error instanceof Error ? error.message : "Failed to fetch user data"
        );
        this.setLoading(false);
      });
    }
  }

  get isLoggedIn(): boolean {
    return !!this.user;
  }

  get userName(): string {
    return this.user?.name ?? "";
  }

  get userEmail(): string {
    return this.user?.email ?? "";
  }
}

export const userStore = new UserStore();
