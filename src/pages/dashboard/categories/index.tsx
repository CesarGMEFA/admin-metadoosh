import { useState } from 'react';
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import toast, { Toaster } from 'react-hot-toast';
import { PlusIcon, XCircleIcon } from '@heroicons/react/24/solid';

// Supabase
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { supabase } from "@lib/supabase-browser";

// interfaces
import { category } from '@interfaces/category.interface';

// Components
import SpinLoader from '@components/common/SpinLoader';


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
};
export default function Categories({categoriesData}:Props) {
	const [inputCategory, setInputCategory] = useState('')
	const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState(categoriesData)

  const submitCategory = async () => {
		try{
			setLoading(true)
			const {error} = await supabase.from('categories')
			.insert([
				{ slug: inputCategory },
			])
			if (error) throw error
		} catch(error) {
			console.error('Error in submitCategory => ', error)
		} finally {
			let { data, error } = await supabase.from('categories').select('id,slug')
			if (error) throw error
			const setData = data as category[]
			setCategories(setData)
			setInputCategory('')
			setLoading(false)
		}
  }

	const handleDelete = async (id:number) => {
		try {
			const { error } = await supabase.from('categories').delete().eq('id', id)
			if(error) throw error
		} catch(error) {
			console.error('Error in handle delete => ', error)
		} finally {
			let { data, error } = await supabase.from('categories').select('id,slug')
			if (error) throw error
			const setData = data as category[]
			setCategories(setData)
			toast.success("sucessfully", {
				position: "bottom-right",
				style: {
					border: '2px black solid'
				}
			})
		}
	}

	return (
		<>
			{/* <Alert alert={alert} handleClose={toggleAlert} /> */}
			<div className='mb-8'>
				<div className='min-w-0 flex-1'>
					<h2 className='text-2xl font-bold leading-7 text-gray-900 mb-4 sm:truncate sm:text-3xl sm:tracking-tight'>
						Custom Categories Page
					</h2>
				</div>
				<div className='mt-5 flex items-center lg:mt-0'>
					<input
						type='text'
						value={inputCategory}
						onChange={(e) => setInputCategory(e.target.value)}
						className='block w-2/5 shadow-sm sm:text-sm border-gray-300 rounded-md
              focus:ring-gray-700 focus:border-gray-700'
					/>
					<span className='sm:ml-3'>
						<button
							type='button'
							onClick={submitCategory}
							className='inline-flex items-center rounded-md bg-gray-doosh px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
						>
							{ loading ? (
								<SpinLoader />
							) : (
								<PlusIcon
									className='-ml-0.5 h-5 w-5'
									aria-hidden='true'
								/>
							) }
							<span className='ml-2'>
								{loading ? "loading" : "Add Category"}
							</span>
						</button>
					</span>
				</div>
			</div>

			<div className='flex flex-col'>
				<div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
					<div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
						<div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
							{/* {totalProducts > 0 && <Pagination totalItems={totalProducts} itemsPerPage={PRODUCT_LIMIT} setOffset={setOffsetProducts} neighbours={3}></Pagination>} */}
							<table className='min-w-full divide-y divide-gray-200'>
								<thead className='bg-gray-50'>
									<tr>
										<th
											scope='col'
											className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											ID
										</th>
										<th
											scope='col'
											className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											Category
										</th>
										<th
											scope='col'
											className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											N. of Products
										</th>
										<th
											scope='col'
											className='relative px-6 py-3'
										>
											<span className='sr-only'>
												Edit
											</span>
										</th>
										<th
											scope='col'
											className='relative px-6 py-3'
										>
											<span className='sr-only'>
												Delete
											</span>
										</th>
									</tr>
								</thead>
								<tbody className='bg-white divide-y divide-gray-200'>
									{categories?.map(({id, slug}:category) => (
										<tr key={`Product-item-${id}`}>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='text-sm font-medium text-gray-900'>
													{id}
												</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='text-sm font-medium text-gray-900'>
													{slug}
												</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												{/* <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">${product.price}</span> */}
											</td>
											{/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.id}</td> */}
											<td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
												{/* <Link href={`/dashboard/edit/${product.id}`}>
                        </Link> */}
												{/* <a className='text-indigo-600 hover:text-indigo-900'>
													Edit
												</a> */}
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
												<XCircleIcon
													className='flex-shrink-0 h-6 w-6 text-gray-400 cursor-pointer
														hover:text-gray-600 focus:text-gray-600'
													aria-hidden='true'
													onClick={() =>
														handleDelete(id)
													}
												/>
											</td>
										</tr>
									))}
								</tbody>
							</table>
							{/* {categories.length === 0 && (
								<h2 className='text-xl p-2'>
									There&apos;re no products
								</h2>
							)} */}
						</div>
					</div>
				</div>
			</div>
			<Toaster />
		</>
	);
}
