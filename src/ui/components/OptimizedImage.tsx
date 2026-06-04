import NextImage, { type ImageProps } from 'next/image'
import { qualityForImageSize } from '@/utils/imageOptimization'

const OptimizedImage = ({ quality, ...props }: ImageProps) => (
    <NextImage quality={quality ?? qualityForImageSize(props)} {...props} />
)

export default OptimizedImage
