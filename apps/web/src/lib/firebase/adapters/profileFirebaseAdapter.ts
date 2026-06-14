import type { CreateProfilePayload, ProfileRepositoryContract, UpdateProfilePayload, UserId } from "@aulify/shared-types";

function notImplemented(methodName: string): never {
  throw new Error(`Firebase adapter method not implemented yet: ${methodName}`);
}

export const profileFirebaseAdapter: ProfileRepositoryContract = {
  async createProfile(_payload: CreateProfilePayload) {
    return notImplemented("profile.createProfile");
  },
  async getProfile(_userId: UserId) {
    return notImplemented("profile.getProfile");
  },
  async updateProfile(_userId: UserId, _payload: UpdateProfilePayload) {
    return notImplemented("profile.updateProfile");
  }
};
