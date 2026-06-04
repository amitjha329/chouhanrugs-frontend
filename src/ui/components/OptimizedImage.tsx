import NextImage, { type ImageProps } from 'next/image'
import { imageQuality } from '@/utils/imageOptimization'

const OptimizedImage = ({ quality, ...props }: ImageProps) => (
    <NextImage quality={quality ?? imageQuality.standard} {...props} />
)

export default OptimizedImage
