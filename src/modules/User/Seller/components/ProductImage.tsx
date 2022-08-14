import { UTrashAltIcon } from 'components/icons';
import { ImageProduct } from './SellerDetailProduct';

interface ProductImageProps {
  productImage: ImageProduct;
  handleDeleteImageProduct?: (value: string) => void;
}
export default function ProductImage({ productImage, handleDeleteImageProduct }: ProductImageProps) {
  return (
    <div className="product-image-wrapper">
      <img src={productImage.imageUrl} className="product-image" alt="product" />
      {handleDeleteImageProduct && (
        <span className="wrapper-delete-icon" onClick={() => handleDeleteImageProduct(productImage.id)}>
          <UTrashAltIcon />
        </span>
      )}
    </div>
  );
}
