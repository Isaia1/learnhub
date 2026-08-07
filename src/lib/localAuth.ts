import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@learnhub_local_users';
const SESSION_KEY = '@learnhub_local_session';

export interface LocalAccount {
  id: string;
  email: string;
  password: string;
  displayName: string;
}

export interface LocalSession {
  userId: string;
  email: string;
}

async function readUsers(): Promise<LocalAccount[]> {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as LocalAccount[];
  } catch {
    return [];
  }
}

async function writeUsers(users: LocalAccount[]): Promise<void> {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function createId(): string {
  return `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export async function getLocalSession(): Promise<LocalSession | null> {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LocalSession;
  } catch {
    return null;
  }
}

export async function clearLocalSession(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}

export async function localSignUp(
  email: string,
  password: string,
  displayName: string
): Promise<{ error: string | null; session: LocalSession | null }> {
  const normalizedEmail = email.trim().toLowerCase();
  const users = await readUsers();

  if (users.some((u) => u.email === normalizedEmail)) {
    return { error: 'An account with this email already exists. Try signing in.', session: null };
  }

  const account: LocalAccount = {
    id: createId(),
    email: normalizedEmail,
    password,
    displayName: displayName.trim(),
  };

  users.push(account);
  await writeUsers(users);

  const session = { userId: account.id, email: account.email };
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { error: null, session };
}

export async function localSignIn(
  email: string,
  password: string
): Promise<{ error: string | null; session: LocalSession | null }> {
  const normalizedEmail = email.trim().toLowerCase();
  const users = await readUsers();
  const account = users.find((u) => u.email === normalizedEmail);

  if (!account || account.password !== password) {
    return { error: 'Invalid email or password.', session: null };
  }

  const session = { userId: account.id, email: account.email };
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { error: null, session };
}

export async function getLocalDisplayName(userId: string): Promise<string | null> {
  const users = await readUsers();
  return users.find((u) => u.id === userId)?.displayName ?? null;
}
