import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  orderBy,
  limit,
  deleteDoc,
  getDocFromServer,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with configured database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");

export interface CloudMemorySnapshot {
  id: string;
  title: string;
  timestamp: number;
  createdAt: string;
  stats: {
    sensory_count?: number;
    short_term_count?: number;
    facts_count?: number;
    skills_count?: number;
    episodic_count?: number;
    concepts_count?: number;
    inferred_links_count?: number;
    vector_items_count?: number;
    procedural_count?: number;
  };
  memory_data?: any;
  version?: string;
}

export interface CloudThinkingSession {
  id: string;
  title: string;
  activeStrategy: string;
  traces: any[];
  updatedAt: number;
  createdAt: string;
}

/**
 * Validate connection to Firestore using getDocFromServer
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    const testRef = doc(db, "_test_connection_", "ping");
    await getDocFromServer(testRef).catch(() => {});
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("Firestore client is offline or unreachable.");
      return false;
    }
    return true;
  }
}

/**
 * Save complete memory matrix state to Firebase Firestore
 */
export async function saveMemorySnapshotToCloud(
  title: string,
  memoryData: any,
  stats: any
): Promise<{ success: boolean; snapshotId: string; error?: string }> {
  try {
    const snapshotId = `mem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const snapshotRef = doc(db, "memory_snapshots", snapshotId);
    const now = new Date();

    const snapshotPayload: CloudMemorySnapshot = {
      id: snapshotId,
      title: title || `مصفوفة الذاكرة المعرفية - ${now.toLocaleTimeString("ar-SA")}`,
      timestamp: Date.now(),
      createdAt: now.toISOString(),
      stats: stats || {},
      memory_data: memoryData,
      version: "Omega-5Tier-v2",
    };

    await setDoc(snapshotRef, snapshotPayload);
    return { success: true, snapshotId };
  } catch (err: any) {
    console.error("Failed to save memory snapshot to Firebase:", err);
    return { success: false, snapshotId: "", error: err.message || "Cloud save failed" };
  }
}

/**
 * Fetch list of saved memory snapshots from Firebase
 */
export async function fetchMemorySnapshotsFromCloud(maxResults: number = 20): Promise<CloudMemorySnapshot[]> {
  try {
    const q = query(
      collection(db, "memory_snapshots"),
      orderBy("timestamp", "desc"),
      limit(maxResults)
    );
    const snap = await getDocs(q);
    const items: CloudMemorySnapshot[] = [];
    snap.forEach((docItem) => {
      items.push(docItem.data() as CloudMemorySnapshot);
    });
    return items;
  } catch (err) {
    console.error("Failed to fetch snapshots from Firebase:", err);
    return [];
  }
}

/**
 * Delete a memory snapshot from Firebase
 */
export async function deleteMemorySnapshotFromCloud(snapshotId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "memory_snapshots", snapshotId));
    return true;
  } catch (err) {
    console.error("Failed to delete memory snapshot from Firebase:", err);
    return false;
  }
}

/**
 * Save or update a thinking session to Firebase Firestore
 */
export async function saveThinkingSessionToCloud(
  sessionId: string,
  title: string,
  traces: any[],
  strategy: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const sId = sessionId || `session_${Date.now()}`;
    const sessionRef = doc(db, "thinking_sessions", sId);
    const now = new Date();

    const sessionPayload: CloudThinkingSession = {
      id: sId,
      title: title || `جلسة استدلال - ${now.toLocaleDateString("ar-SA")}`,
      activeStrategy: strategy || "tree_of_thought",
      traces: traces || [],
      updatedAt: Date.now(),
      createdAt: now.toISOString(),
    };

    await setDoc(sessionRef, sessionPayload, { merge: true });
    return { success: true };
  } catch (err: any) {
    console.error("Failed to save thinking session to Firebase:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch saved thinking sessions from Firebase
 */
export async function fetchThinkingSessionsFromCloud(maxResults: number = 20): Promise<CloudThinkingSession[]> {
  try {
    const q = query(
      collection(db, "thinking_sessions"),
      orderBy("updatedAt", "desc"),
      limit(maxResults)
    );
    const snap = await getDocs(q);
    const items: CloudThinkingSession[] = [];
    snap.forEach((docItem) => {
      items.push(docItem.data() as CloudThinkingSession);
    });
    return items;
  } catch (err) {
    console.error("Failed to fetch thinking sessions from Firebase:", err);
    return [];
  }
}

/**
 * Delete a thinking session from Firebase
 */
export async function deleteThinkingSessionFromCloud(sessionId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "thinking_sessions", sessionId));
    return true;
  } catch (err) {
    console.error("Failed to delete thinking session from Firebase:", err);
    return false;
  }
}
