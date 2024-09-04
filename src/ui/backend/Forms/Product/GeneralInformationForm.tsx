'use client'
import getBrandsList from '@/lib/actions/getBrandsList'
import getCategoriesList from '@/lib/actions/getCategoriesList'
import getColorsList from '@/lib/actions/getColorsList'
import getPatternList from '@/lib/actions/getPatternList'
import getShapeList from '@/lib/actions/getShapeList'
import getTagsList from '@/lib/actions/getTagsList'
import saveProductGeneralInformation from '@/lib/actions/saveProductGeneralInformation'
import BrandDataModel from '@/lib/types/BrandDataModel'
import CategoriesDataModel from '@/lib/types/CategoriesDataModel'
import ColorDataModel from '@/lib/types/ColorDataModel'
import PatternDataModel from '@/lib/types/PatternDataModel'
import ShapeDataModel from '@/lib/types/ShapeDataModel'
import TagDataModel from '@/lib/types/TagDataModel'
import removeExtraSpaceandIllegealChars from '@/lib/utilities/removeExtraSpaceandIllegealChars'
import onPageNotifications from '@/ui/common/onPageNotifications'
import { Listbox } from '@headlessui/react'
import React, { Fragment, useState, useEffect } from 'react'
import { BiChevronDown } from 'react-icons/bi'
import slugify from 'slugify'

type propTypes = {
  productId: string
  productBaseColor: ColorDataModel
  productCategory: string
  productName: string
  productShape: string
  productPattern: string
  productBrand: string
  productUrl: string
  productTags: string[]
}

const GeneralInformationForm = ({ productId, productBaseColor, productBrand, productCategory, productName, productTags, productPattern, productShape, productUrl }: propTypes) => {
  const [tags, setTags] = useState<TagDataModel[]>([])
  const [colors, setColors] = useState<ColorDataModel[]>([])
  const [brands, setBrands] = useState<BrandDataModel[]>([])
  const [categories, setCategories] = useState<CategoriesDataModel[]>([])
  const [patternList, setPatternList] = useState<PatternDataModel[]>([])
  const [shapeList, setShapeList] = useState<ShapeDataModel[]>([])
  const [selectedTags, setselectedTags] = useState<Array<string>>(productTags)
  const [productNameNew, setproductName] = useState<string>(productName)
  const [productURLNew, setproductURLNew] = useState<string>(productUrl)
  const [productCategoryNew, setProductCategoryNew] = useState<string>(productCategory)
  const [productBrandnew, setProductBrandnew] = useState<string>(productBrand)
  const [productBaseColorNew, setProductBaseColornew] = useState<ColorDataModel>(productBaseColor)
  const [productShapeNew, setProductShapenew] = useState<string>(productShape)
  const [productPatternNew, setProductPatternnew] = useState<string>(productPattern)

  useEffect(() => {
    Promise.all([getColorsList(), getTagsList(), getBrandsList(), getCategoriesList(), getPatternList(), getShapeList()]).then(([colorsList, tagsList, brandsList, categoriesList, patternList, shapeList]) => {
      setColors(colorsList)
      setBrands(brandsList)
      setTags(tagsList)
      setCategories(categoriesList)
      setPatternList(patternList)
      setShapeList(shapeList)
    }).catch(err => {
      console.log(err)
    })
  }, [])
  


  const handleTagRemove = (tagId: string) => {
    return selectedTags.filter(tg => tg != tagId)
  }
  return (
    <div className='card card-bordered card-body shadow-md mb-5'>
      <div className='card-title'>Product General Information</div>
      <label className='input-group input-group-lg input-group-vertical'>
        <span>Product Name</span>
        <input type="text" className='input input-bordered w-full' name="product_name" placeholder='Name' required onChange={e => { setproductName(e.currentTarget.value); setproductURLNew(removeExtraSpaceandIllegealChars(e.currentTarget.value).split(' ').join('-')) }} value={productNameNew} />
      </label>
      <label className='input-group input-group-lg input-group-vertical'>
        <span>Product URL</span>
        <input type="text" className='input input-bordered w-full' name="product_name" placeholder='Name' required onChange={e =>
          setproductURLNew(slugify(e.currentTarget.value, { trim: true, lower: true, strict: true }))} value={productURLNew} />
      </label>
      <label className='input-group input-group-lg input-group-vertical'>
        <span>Product Brand</span>
        <select className='select select-bordered w-full' name="product_brand" defaultValue={0} onChange={e => setProductBrandnew(e.currentTarget.value)} required>
          <option value={0} disabled>Select Product Brand</option>
          {
            brands.map(brand => {
              return <option key={brand._id} selected={brand.name == productBrand}>{brand.name}</option>
            })
          }
        </select>
      </label>
      <label className='input-group input-group-lg input-group-vertical'>
        <span>Product Category</span>
        <select className='select select-bordered w-full' name="product_category" defaultValue={0} onChange={e => setProductCategoryNew(e.currentTarget.value)} required>
          <option value={0} disabled>Select Product Category</option>
          {
            categories.map(cat => {
              return <option key={cat._id} selected={cat.name == productCategory}>{cat.name}</option>
            })
          }
        </select>
      </label>
      <label className='input-group input-group-lg input-group-vertical relative'>
        <span>Product Tags</span>
        <Listbox value={selectedTags} onChange={setselectedTags} multiple as={Fragment}>
          <Listbox.Button className="input input-bordered w-full">
            {selectedTags.length > 0 && (
              <ul className='flex flex-row gap-3'>
                {selectedTags.map((tag) => (
                  <li key={tag} className="bg-blue-400 !rounded-md px-3 text-primary-content" onClick={() => setselectedTags(handleTagRemove(tag))}>{tag}</li>
                ))}
              </ul>
            )}
            <div className="pointer-events-none absolute right-0 top-12 flex items-center pr-2">
              <BiChevronDown
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
          </Listbox.Button>
          <Listbox.Options className="flex items-start gap-3 flex-row px-7 py-3 border-b border-l border-r">
            {tags.map((tag) => (
              <Listbox.Option key={tag._id} value={tag.name} className="!rounded-md bg-gray-400 text-primary-content px-3">
                {tag.name}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
      </label>
      <label className='input-group input-group-lg input-group-vertical relative'>
        <span>Base Color</span>
        <select className='input input-bordered w-full' name="product_base_color" onChange={e => setProductBaseColornew(JSON.parse(e.currentTarget.value))} required>
          <option value={"{}"}>None</option>
          {
            colors.map(color => {
              return (
                <option key={color.name} value={JSON.stringify(color)} selected={color._id == productBaseColor._id}>{color.name}</option>
              )
            })
          }
        </select>
      </label>
      <label className='input-group input-group-lg input-group-vertical relative'>
        <span>Shape</span>
        <select className='input input-bordered w-full' name="product_base_color" onChange={e => setProductShapenew(e.currentTarget.value)} required>
          <option value={"{}"}>None</option>
          {
            shapeList.map(shape => {
              return (
                <option key={shape.name} value={JSON.stringify(shape)} selected={shape._id == JSON.parse(productShape)._id}>{shape.name}</option>
              )
            })
          }
        </select>
      </label>
      <label className='input-group input-group-lg input-group-vertical relative'>
        <span>Pattern</span>
        <select className='input input-bordered w-full' name="product_base_color" onChange={e => setProductPatternnew(e.currentTarget.value)} required>
          <option value={"{}"}>None</option>
          {
            patternList.map(pattern => {
              return (
                <option key={pattern.name} value={JSON.stringify(pattern)} selected={pattern._id == JSON.parse(productPattern)._id}>{pattern.name}</option>
              )
            })
          }
        </select>
      </label>
      <div className='card-actions justify-end'>
        <button className='btn btn-primary' onClick={() => {
          saveProductGeneralInformation(productId, JSON.stringify(productBaseColorNew), productCategoryNew, productBrandnew, selectedTags, productNameNew, productURLNew, productPatternNew, productShapeNew).then(res => {
            if (res.ack) {
              onPageNotifications("success", "General Information Updated")
            } else {
              console.log(res.result)
            }
          }).catch(err => console.log(err))
        }}>Save</button>
      </div>
    </div>
  )
}

export default GeneralInformationForm