import type {
  AddCourseMemberPayload,
  AulifyUser,
  Course,
  CourseId,
  CourseMember,
  CreateCoursePayload,
  CreateProfilePayload,
  CreateUserPayload,
  UpdateCourseMemberPayload,
  UpdateCoursePayload,
  UpdateProfilePayload,
  UserId,
  UserProfile
} from "../domain";

export type EmailPasswordCredentials = {
  email: string;
  password: string;
};

export type RegisterUserPayload = EmailPasswordCredentials & {
  displayName: string;
  role: AulifyUser["role"];
};

export interface AuthRepositoryContract {
  createUser(payload: CreateUserPayload): Promise<AulifyUser>;
  getCurrentUser(): Promise<AulifyUser | null>;
  getUserById(userId: UserId): Promise<AulifyUser | null>;
  loginWithEmailPassword(credentials: EmailPasswordCredentials): Promise<AulifyUser>;
  logout(): Promise<void>;
  registerWithEmailPassword(payload: RegisterUserPayload): Promise<AulifyUser>;
  updateUser(userId: UserId, payload: Partial<Pick<AulifyUser, "email" | "role">>): Promise<AulifyUser>;
}

export interface ProfileRepositoryContract {
  createProfile(payload: CreateProfilePayload): Promise<UserProfile>;
  getProfile(userId: UserId): Promise<UserProfile | null>;
  updateProfile(userId: UserId, payload: UpdateProfilePayload): Promise<UserProfile>;
}

export interface CourseRepositoryContract {
  archiveCourse(courseId: CourseId): Promise<void>;
  createCourse(payload: CreateCoursePayload): Promise<Course>;
  getCourseById(courseId: CourseId): Promise<Course | null>;
  getCoursesByStudent(studentId: UserId): Promise<Course[]>;
  getCoursesByTeacher(teacherId: UserId): Promise<Course[]>;
  updateCourse(courseId: CourseId, payload: UpdateCoursePayload): Promise<Course>;
}

export interface CourseMemberRepositoryContract {
  addCourseMember(payload: AddCourseMemberPayload): Promise<CourseMember>;
  getCourseMember(courseId: CourseId, userId: UserId): Promise<CourseMember | null>;
  getCourseMembers(courseId: CourseId): Promise<CourseMember[]>;
  getCourseMembersByUser(userId: UserId): Promise<CourseMember[]>;
  removeCourseMember(courseId: CourseId, userId: UserId): Promise<void>;
  updateCourseMember(courseId: CourseId, userId: UserId, payload: UpdateCourseMemberPayload): Promise<CourseMember>;
}
