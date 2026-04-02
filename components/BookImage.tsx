import Image from 'next/image';

type BookImageProps = {
    src?: string;
    alt?: string;
    className?: string;
    width?: number;
    height?: number;
};

export default function BookImage({
    src,
    alt,
    className,
    width = 96,
    height = 128,
}: BookImageProps) {
    return (
        <Image
            src={src || '/book_placeholder.png'}
            alt={alt || 'Book cover'}
            width={width}
            height={height}
            className={className}
        />
    );
}