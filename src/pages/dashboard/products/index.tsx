import { useState, useEffect } from 'react';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import toast, { Toaster } from 'react-hot-toast';
import { PlusIcon, XCircleIcon } from '@heroicons/react/24/solid';

// interfaces
import { category } from '@interfaces/category.interface';

// components
import Modal from '@components/common/Modal';
import FormProduct from '@components/FormProduct';

// import { endPoints } from '@services/api';
// import { deleteProduct } from '@services/api/products';
// import useAlert from '@hooks/useAlert';
// import Alert from '@common/Alert';


// function classNames(...classes) {
//   return classes.filter(Boolean).join(' ');
// }

export async function getServerSideProps(ctx: GetServerSidePropsContext | { req: NextApiRequest; res: NextApiResponse; }) {
	const serverSupabase = createServerSupabaseClient(ctx)

	const {
    data: { session }
  } = await serverSupabase.auth.getSession()

	if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

	let { data: categoriesData, error } = await serverSupabase
  .from('categories')
  .select('id,slug')
	if (error) throw error

  return {
    props: {
			categoriesData
		}
  }
}

type Props = {
  categoriesData: category[]
}
export default function Products({ categoriesData }:Props ) {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  // const { alert, setAlert, toggleAlert } = useAlert();

  // useEffect(() => {
  //   (async() => {
  //     const {data: session} = await supabase.auth.getSession()
  //     if (!session) {
  //       console.log('session in layout verification', session)
  //       router.push('/')
  //     }
  //   })()
  // }, []);

  // useEffect(() => {
  //   async function getProducts() {
  //     const response = await axios.get(endPoints.products.getAllProducts);
  //     setProducts(response.data);
  //   }
  //   try {
  //     getProducts();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, [alert]);

  // const handleDelete = (id) => {
  //   deleteProduct(id)
  //     .then(() => {
  //       setAlert({
  //         active: true,
  //         message: 'Product Deleted',
  //         type: 'success',
  //         autoClose: false,
  //       });
  //     })
  //     .catch((error) => {
  //       setAlert({
  //         active: true,
  //         message: error.message,
  //         type: 'error',
  //         autoClose: false,
  //       });
  //     });
  // };

  return (
    <>
      {/* <Alert alert={alert} handleClose={toggleAlert} /> */}
      <div className="lg:flex lg:items-center lg:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">List Of Products</h2>
        </div>
        <div className="mt-5 flex lg:ml-4 lg:mt-0">
          <span className="sm:ml-3">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => setOpen(true)}
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Add Product
            </button>
          </span>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              {/* {totalProducts > 0 && <Pagination totalItems={totalProducts} itemsPerPage={PRODUCT_LIMIT} setOffset={setOffsetProducts} neighbours={3}></Pagination>} */}
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Id
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Delete</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* {products?.map((product) => (
                    <tr key={`Product-item-${product.id}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full" src={product.images[0]} alt="" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.category.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">${product.price}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/dashboard/edit/${product.id}`}>
                            <a className="text-indigo-600 hover:text-indigo-900">Edit</a>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <XCircleIcon className="flex-shrink-0 h-6 w-6 text-gray-400 cursor-pointer" aria-hidden="true" onClick={() => handleDelete(product.id)} />
                      </td>
                    </tr>
                  ))} */}
                </tbody>
              </table>
              {products.length === 0 && <h2 className='text-xl p-2'>There&apos;re no products</h2>}
            </div>
          </div>
        </div>
      </div>
      <Modal open={open} setOpen={setOpen}>
        <FormProduct />
        {/* <FormProduct setOpen={setOpen} setAlert={setAlert} /> */}
      </Modal>
    </>
  );
}
