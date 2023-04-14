import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import { Listbox } from "@headlessui/react";

// lib
import { supabase } from "@lib/supabase-browser";

// interface
import { category } from "@interfaces/category.interface";

// components
import MultiSelectInput from "@components/common/MultiSelectInput";

export default function FormProduct() {
	const formRef = useRef(null);
	const [categories, setCategories] = useState([] as category[])
	const [categorieSelected, setCategorieSelected] = useState([categories[0]])
	const [priceData, setPriceData] = useState([] as string[]);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	// const supabase = createBrowserSupabaseClient()
	// useEffect(() => {
	//   const categoryTag = document.querySelector('#category');
	//   categoryTag.value = product?.category?.id;
	// }, [product]);

	// precio [25,100,200]

	const handleSubmit = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		try {
			setLoading(true);
			const formData: any = new FormData(formRef.current as any);

			const dataForm = {
				title: formData.get("title"),
				price: priceData,
				description: formData.get("description"),
				categoryId: parseInt(formData.get("category")),
				images: [formData.get("images")],
			};
			console.log("dataForm", dataForm);
			// const file = `${uuidv4()}-${dataForm.images[0].name}`
			// const {data, error} = await supabase.storage
			//                       .from('images')
			//                       .upload(`public/${file}`, dataForm.images[0] as File, {contentType: "image/*"})
			// if (data) {
			//   const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(`public/${file}`)

			//   const { data: success, error } = await supabase
			//   .from('giftcards')
			//   .insert([
			//     { title: dataForm.title, description: dataForm.description, price: [dataForm.price], imageSrc: publicUrl },
			//   ])
			//   if (error) throw error

			// } else if (error) throw error
		} catch (e) {
			console.error("Error => ", e);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		(async () => {
			let { data, error } = await supabase.from('categories').select('id,slug')
			const categoriesData = data as category[]
			setCategories(categoriesData)
			if (error) throw error
		})()
	}, [])

	return (
		<form ref={formRef} onSubmit={handleSubmit}>
			<div className='overflow-hidden'>
				<div className='px-4 py-5 bg-white sm:p-6'>
					<div className='grid grid-cols-6 gap-6'>
						<div className='col-span-6 sm:col-span-3'>
							<label
								htmlFor='title'
								className='block text-sm font-medium text-gray-700'
							>
								Title
							</label>
							<input
								// defaultValue={product?.title}
								type='text'
								name='title'
								id='title'
								required
								className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
							/>
						</div>
						<div className='col-span-6 sm:col-span-3'>
							<label
								htmlFor='price'
								className='block text-sm font-medium text-gray-700'
							>
								Price
							</label>
							<MultiSelectInput
								selectType='price'
								setData={setPriceData}
							/>
						</div>
						<div className='col-span-6'>
							<label
								htmlFor='category'
								className='block text-sm font-medium text-gray-700'
							>
								Category
							</label>
							<select
								id='category'
								name='category'
								// defaultValue={product?.category}
								autoComplete='category-name'
								multiple
								// className='multiselect'
								// multiselect-search='true'
								// multiselect-select-all='true'
								className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
							>
								{categories?.map(({id, slug}:category) => (
									<option key={id} value={id}>{ slug }</option>
								))}
							</select>
						</div>

						<div className='col-span-6'>
							<label
								htmlFor='description'
								className='block text-sm font-medium text-gray-700'
							>
								Description
							</label>
							<textarea
								// defaultValue={product?.description}
								name='description'
								id='description'
								autoComplete='description'
								rows={3}
								className='form-textarea mt-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 block shadow-sm sm:text-sm border-gray-300 rounded-md'
							/>
						</div>
						<div className='col-span-6'>
							<div>
								<label className='block text-sm font-medium text-gray-700'>
									Cover photo
								</label>
								<div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md'>
									<div className='space-y-1 text-center'>
										<svg
											className='mx-auto h-12 w-12 text-gray-400'
											stroke='currentColor'
											fill='none'
											viewBox='0 0 48 48'
											aria-hidden='true'
										>
											<path
												d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
												strokeWidth={2}
												strokeLinecap='round'
												strokeLinejoin='round'
											/>
										</svg>
										<div className='flex text-sm text-gray-600'>
											<label
												htmlFor='images'
												className='relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500'
											>
												<span>Upload a file</span>
												<input
													// defaultValue={product?.images}
													id='images'
													name='images'
													type='file'
													accept='image/*'
													className='sr-only'
												/>
											</label>
											<p className='pl-1'>
												or drag and drop
											</p>
										</div>
										<p className='text-xs text-gray-500'>
											PNG, JPG, GIF up to 10MB
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='px-4 py-3 bg-gray-50 text-right sm:px-6'>
					<button
						type='submit'
						className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
					>
						{loading ? "Loading" : "Send"}
					</button>
				</div>
			</div>
		</form>
	);
}
