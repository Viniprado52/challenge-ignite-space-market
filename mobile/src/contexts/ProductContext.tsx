import { 
  useState,
  ReactNode,
  createContext,
} from "react";

import { ProductDTO } from "@dtos/ProductDTO"

export type ProductContextDataProps = {
  product: ProductDTO;
  productImages: Array<ImageProduct>;
  productImagesEditDelete: Array<string>;
  productImagesEditAdded: Array<string>;
  setProductToCreate: (product: ProductDTO) => void;
  setProductImagesToCreate: (images: Array<ImageProduct>) => void;
  setProductImagesDeleteToEdit: (ids: Array<string>) => void;
  setProductImagesAddedToEdit: (paths: Array<string>) => void;
}

export type ImageProduct = {
  id?: string;
  path: string;
};

type ProductContextProviderProps = {
  children: ReactNode;
};

export const ProductContext = createContext<ProductContextDataProps>({} as ProductContextDataProps);

export function PrductContextProvider({ children }: ProductContextProviderProps)  {

  const [product, setProduct] = useState<ProductDTO>({} as ProductDTO);
  const [productImages, setProductImages] = useState<Array<ImageProduct>>([]);
  const [productImagesEditDelete, setProductImagesEditDelete] = useState<Array<string>>([]);
  const [productImagesEditAdded, setProductImagesEditAdded] = useState<Array<string>>([]);

  function setProductToCreate(product: ProductDTO) {
    setProduct(product);
  }

  function setProductImagesToCreate(images: Array<ImageProduct>) {
    setProductImages(images);
  }

  function setProductImagesDeleteToEdit(ids: Array<string>) {
    setProductImagesEditDelete(ids);
  }

  function setProductImagesAddedToEdit(paths: Array<string>) {
    setProductImagesEditAdded(paths);
  }

  return (
    <ProductContext.Provider value={{ 
      product, 
      setProductToCreate,
      productImages,
      setProductImagesToCreate,
      productImagesEditDelete,
      setProductImagesDeleteToEdit,
      productImagesEditAdded,
      setProductImagesAddedToEdit
    }}>
      {children}
    </ProductContext.Provider>
  );
}