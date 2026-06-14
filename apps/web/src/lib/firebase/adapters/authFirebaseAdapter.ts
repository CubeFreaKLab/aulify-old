import type { AuthRepositoryContract, CreateUserPayload, EmailPasswordCredentials, RegisterUserPayload, UserId } from "@aulify/shared-types";

function notImplemented(methodName: string): never {
  throw new Error(`Firebase adapter method not implemented yet: ${methodName}`);
}

export const authFirebaseAdapter: AuthRepositoryContract = {
  async createUser(_payload: CreateUserPayload) {
    return notImplemented("auth.createUser");
  },
  async getCurrentUser() {
    return notImplemented("auth.getCurrentUser");
  },
  async getUserById(_userId: UserId) {
    return notImplemented("auth.getUserById");
  },
  async loginWithEmailPassword(_credentials: EmailPasswordCredentials) {
    return notImplemented("auth.loginWithEmailPassword");
  },
  async logout() {
    return notImplemented("auth.logout");
  },
  async registerWithEmailPassword(_payload: RegisterUserPayload) {
    return notImplemented("auth.registerWithEmailPassword");
  },
  async updateUser(_userId: UserId, _payload) {
    return notImplemented("auth.updateUser");
  }
};
