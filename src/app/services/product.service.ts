import { Injectable, inject } from "@angular/core";
import {
  Firestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  getDoc,
  QueryDocumentSnapshot,
  DocumentData,
} from '@angular/fire/firestore';
import { Product } from "../models/product.model";

@Injectable({ providedIn: "root" })
export class ProductService {
  private firestore = inject(Firestore);
  private productsCollection = collection(this.firestore, "products");

  async getProductsPage(
    pageSize: number,
    startAfterDoc: QueryDocumentSnapshot<DocumentData> | null = null
  ) {
    // Pedimos (pageSize + 1) para determinar fácilmente si hay más registros (hasMore)
    const fetchLimit = pageSize + 1;

    let q = query(
      this.productsCollection,
      orderBy('createdAt', 'desc'),
      limit(fetchLimit)
    );

    // Si recibimos un cursor, comenzamos después de ese documento
    if (startAfterDoc) {
      q = query(
        this.productsCollection,
        orderBy('createdAt', 'desc'),
        startAfter(startAfterDoc),
        limit(fetchLimit)
      );
    }

    const snapshot = await getDocs(q);
    const docs = snapshot.docs;

    // Verificamos si hay más productos para habilitar el botón "Siguiente"
    const hasMore = docs.length > pageSize;

    // Recortamos el arreglo para mostrar exactamente la cantidad solicitada
    const pageDocs = hasMore ? docs.slice(0, pageSize) : docs;

    const products: Product[] = pageDocs.map((d) => ({
      id: d.id,
      ...(d.data() as Product),
    }));

    // El último documento servirá de cursor para la siguiente página
    const lastDoc = pageDocs.length > 0 ? pageDocs[pageDocs.length - 1] : null;

    return {
      products,
      hasMore,
      lastDoc,
    };
  }

  // 👇 NUEVO MÉTODO: Obtiene un solo producto por su ID para editar
  async getProductById(id: string): Promise<Product | null> {
    const docRef = doc(this.firestore, "products", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return null;
  }

  async addProduct(product: Partial<Product>) {
    const payload: any = {
      name: product.name,
      price: product.price,
      inStock: product.inStock,
      description: product.description,
      sizes: product.sizes,
      imageUrl: product.imageUrl,
      createdAt: Date.now(),
    };

    return addDoc(this.productsCollection, payload);
  }

  updateProduct(id: string, product: Partial<Product>) {
    const ref = doc(this.firestore, "products", id);
    return updateDoc(ref, { ...product });
  }

  deleteProduct(id: string) {
    const ref = doc(this.firestore, "products", id);
    return deleteDoc(ref);
  }
}