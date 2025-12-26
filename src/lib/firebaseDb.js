import { 
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from "firebase/firestore";
import { db } from "./firebase";

// Collections
const COLLECTIONS = {
  USERS: 'users',
  RESOURCES: 'resources',
  POSTS: 'posts',
  REVIEWS: 'reviews'
};

// User operations
export const createUser = async (userId, userData) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    // Use setDoc with merge to create or update
    await setDoc(userRef, {
      ...userData,
      id: userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUser = async (userId) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return { success: true, data: userSnap.data() };
    }
    return { success: false, error: 'User not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Resource operations
export const createResource = async (resourceData) => {
  try {
    const resourceRef = await addDoc(collection(db, COLLECTIONS.RESOURCES), {
      ...resourceData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return { success: true, id: resourceRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getResources = async (filters = {}) => {
  try {
    let resourcesQuery = query(collection(db, COLLECTIONS.RESOURCES));
    
    // Apply filters
    if (filters.subject) {
      resourcesQuery = query(resourcesQuery, where('subject', '==', filters.subject));
    }
    if (filters.userId) {
      resourcesQuery = query(resourcesQuery, where('userId', '==', filters.userId));
    }
    
    // Order by
    resourcesQuery = query(resourcesQuery, orderBy('createdAt', 'desc'));
    
    // Limit
    if (filters.limit) {
      resourcesQuery = query(resourcesQuery, limit(filters.limit));
    }
    
    const querySnapshot = await getDocs(resourcesQuery);
    const resources = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { success: true, data: resources };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getResource = async (resourceId) => {
  try {
    const resourceRef = doc(db, COLLECTIONS.RESOURCES, resourceId);
    const resourceSnap = await getDoc(resourceRef);
    if (resourceSnap.exists()) {
      return { success: true, data: { id: resourceSnap.id, ...resourceSnap.data() } };
    }
    return { success: false, error: 'Resource not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateResource = async (resourceId, updateData) => {
  try {
    const resourceRef = doc(db, COLLECTIONS.RESOURCES, resourceId);
    await updateDoc(resourceRef, {
      ...updateData,
      updatedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteResource = async (resourceId) => {
  try {
    const resourceRef = doc(db, COLLECTIONS.RESOURCES, resourceId);
    await deleteDoc(resourceRef);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Export collections constant
export { COLLECTIONS };

