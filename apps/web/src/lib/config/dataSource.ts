export type AulifyDataSource = "mock" | "firebase";

export function getDataSource(): AulifyDataSource {
  return process.env.NEXT_PUBLIC_AULIFY_DATA_SOURCE === "firebase" ? "firebase" : "mock";
}

export function isFirebaseDataSource() {
  return getDataSource() === "firebase";
}
