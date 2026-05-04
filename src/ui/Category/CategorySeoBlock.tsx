import CategoriesDataModel from '@/types/CategoriesDataModel'
import clsx from 'clsx'

function hasText(value?: string) {
    return String(value ?? '')
        .replace(/<[^>]*>/g, '')
        .trim().length > 0
}

const CategorySeoBlock = ({ category }: { category: CategoriesDataModel }) => {
    const showTitle = hasText(category.seoTitle)
    const showDescription = hasText(category.seoDescription)

    if (!showTitle && !showDescription) return null

    return (
        <section className="bg-secondary/40 border-y border-primary/10">
            <div className="fluid_container mx-auto px-5 py-6 sm:py-8 lg:px-0 lg:py-10">
                <div className="max-w-6xl">
                    <div className="flex flex-col gap-5 rounded-none bg-base-100/80 px-5 py-5 shadow-sm ring-1 ring-primary/10 sm:px-7 sm:py-6 lg:flex-row lg:items-start lg:gap-8 lg:px-9 lg:py-8">
                        <div className="flex min-w-0 flex-1 flex-col">
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                <span className="h-8 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                                <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                                    {category.name}
                                </span>
                            </div>

                            {showTitle && (
                                <h1 className="max-w-4xl text-2xl font-semibold leading-tight text-base-content sm:text-3xl lg:text-4xl">
                                    {category.seoTitle}
                                </h1>
                            )}

                            {showDescription && (
                                <div
                                    className={clsx(
                                        'mt-4 max-w-5xl text-sm leading-7 text-base-content/75 sm:text-base',
                                        '[&_a]:font-medium [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline',
                                        '[&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-base-content sm:[&_h2]:text-2xl',
                                        '[&_h3]:mt-5 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-base-content',
                                        '[&_li]:my-1 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-3 [&_strong]:text-base-content [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5'
                                    )}
                                    dangerouslySetInnerHTML={{ __html: category.seoDescription ?? '' }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CategorySeoBlock
