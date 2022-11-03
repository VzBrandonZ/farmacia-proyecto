import React, {useState, useCallback} from 'react'
import DashboardWrapper from '../../components/DashboardWrapper'
import Products from '../../components/dashboard/products/Products'
import AddNewProduct from '../../components/dashboard/products/AddNewProduct'
import axios from "axios"

import { BASE_URL_API } from '../../components/lib/urlApi'

const DashboardProducts = ({dataProducts, dataCategories}) => {
  const [showNewProductoForm, setShowNewProductoForm] = useState(false);
  const [currentDataProducts, setCurrentDataProducts] = useState(dataProducts)

  const totalDataLength = dataProducts.length

  const handleShowForm = () => {
    setShowNewProductoForm(true)
  }
  const handleHideForm = () => {
    setShowNewProductoForm(false)
  }

  const refreshData = async () => {
    console.log("Refreshing data!");
    const resultProducts = await axios.get(BASE_URL_API+"/products")
    const dataProductsResult = resultProducts.data;
    setCurrentDataProducts(dataProductsResult)    
  }

  const searchFieldHandler = useCallback(
    (value) =>{
      const valueLower = value.toLowerCase()
      setCurrentDataProducts((prevDataProducts)=>prevDataProducts.filter((prod)=>prod.name.toLowerCase().startsWith(valueLower)))
    },
    [dataProducts],
  )

  const categoryFilterHandler = (idCateg) => {
    console.log(`Category filter handler: ${idCateg}`);
    setCurrentDataProducts(()=>dataProducts.filter((prod)=>prod.category.id===idCateg))
  }

  const resetDataProductsInitialValue = () => {
    // refreshData() or 
    setCurrentDataProducts(dataProducts)
  }
  
  // useEffect(() => {
  //   if (showNewProductoForm){
  //     const handleEsc = (event) => {
  //       if (event.keyCode === 27) {
  //        setShowNewProductoForm(false);
  //      }
  //    };
  //    window.addEventListener('keydown', handleEsc);
  //    return () => {
  //     window.removeEventListener('keydown', handleEsc);
  //     };
  //   }
  //   return () => {
  //   };
  // }, [showNewProductoForm]); 

  return (
  <>
    {
      showNewProductoForm?(
        <AddNewProduct refreshAction={refreshData} handleClick={handleHideForm} categories={dataCategories} />
      ):('')
    }
    <DashboardWrapper>
        <Products refreshAction={refreshData} totalLength={totalDataLength} triggerOnBlankField={resetDataProductsInitialValue} categoryFilterHandler={categoryFilterHandler} searchHandler={searchFieldHandler} handleClick={handleShowForm} medicineData={currentDataProducts} categories={dataCategories} />
    </DashboardWrapper>
  </>  
  )
}

export async function getStaticProps() {
    const resultProducts = await axios.get(BASE_URL_API+"/products")
    const dataProducts = resultProducts.data;
    const resultCategories = await axios.get(BASE_URL_API+"/categories")
    const dataCategories = resultCategories.data;
    return {
      props: {
        dataProducts,
        dataCategories,
      },
    }
  }
  
export default DashboardProducts