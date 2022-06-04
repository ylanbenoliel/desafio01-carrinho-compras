import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { Product, Stock } from "../types";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

const storageKey = "@RocketShoes:cart";

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem(storageKey);

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const { data: product } = await api.get<Product>(
        `/products/${productId}`
      );

      const { data: productInfo } = await api.get<Stock>(`/stock/${productId}`);

      const hasProductInCart = cart.find((item) => item.id === product.id);

      const updatedProduct: Product = hasProductInCart
        ? { ...hasProductInCart, amount: hasProductInCart.amount + 1 }
        : { ...product, amount: 1 };

      if (updatedProduct.amount > productInfo.amount) {
        throw new Error("Quantidade solicitada fora de estoque");
      }

      const updatedCart = cart.map((item) => {
        if (item.id === updatedProduct.id) {
          return updatedProduct;
        }
        return item;
      });

      setCart(updatedCart);

      localStorage.setItem(storageKey, JSON.stringify(updatedCart));
    } catch (e) {
      if (e instanceof Error) toast.error(`${e.message}`);
      toast.error("Erro na adição do produto");
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
