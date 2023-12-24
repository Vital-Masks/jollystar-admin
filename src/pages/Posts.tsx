import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';
import IconX from '../components/Icon/IconX';
import IconFolder from '../components/Icon/IconFolder';
import IconSearch from '../components/Icon/IconSearch';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { convertFileToBase64 } from '../components/utils/fileUtils';


const Posts = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('File Management'));
    });
    const [addContactModal, setAddContactModal] = useState<any>(false);

    const [value, setValue] = useState<any>('list');
    const [defaultParams] = useState({

        "_id": "",
        "title": "",
        "description": "",
        "coverImage": "",
        "gallery": [
        ],
        "isDeleted": true,
    });

    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));

    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };

    const [quilvalue, setQuilValue] = useState(
        '<h1>This is a heading text...</h1><br /><p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dui arcu, pellentesque id mattis sed, mattis semper erat. Etiam commodo arcu a mollis consequat. Curabitur pretium auctor tortor, bibendum placerat elit feugiat et. Ut ac turpis nec dui ullamcorper ornare. Vestibulum finibus quis magna at accumsan. Praesent a purus vitae tortor fringilla tempus vel non purus. Suspendisse eleifend nibh porta dolor ullamcorper laoreet. Ut sit amet ipsum vitae lectus pharetra tincidunt. In ipsum quam, iaculis at erat ut, fermentum efficitur ipsum. Nunc odio diam, fringilla in auctor et, scelerisque at lorem. Sed convallis tempor dolor eu dictum. Cras ornare ornare imperdiet. Pellentesque sagittis lacus non libero fringilla faucibus. Aenean ullamcorper enim et metus vestibulum, eu aliquam nunc placerat. Praesent fringilla dolor sit amet leo pulvinar semper. </p><br /><p> Curabitur vel tincidunt dui. Duis vestibulum eget velit sit amet aliquet. Curabitur vitae cursus ex. Aliquam pulvinar vulputate ullamcorper. Maecenas luctus in eros et aliquet. Cras auctor luctus nisl a consectetur. Morbi hendrerit nisi nunc, quis egestas nibh consectetur nec. Aliquam vel lorem enim. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nunc placerat, enim quis varius luctus, enim arcu tincidunt purus, in vulputate tortor mi a tortor. Praesent porta ornare fermentum. Praesent sed ligula at ante tempor posuere a at lorem. </p><br /><p> Curabitur vel tincidunt dui. Duis vestibulum eget velit sit amet aliquet. Curabitur vitae cursus ex. Aliquam pulvinar vulputate ullamcorper. Maecenas luctus in eros et aliquet. Cras auctor luctus nisl a consectetur. Morbi hendrerit nisi nunc, quis egestas nibh consectetur nec. Aliquam vel lorem enim. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nunc placerat, enim quis varius luctus, enim arcu tincidunt purus, in vulputate tortor mi a tortor. Praesent porta ornare fermentum. Praesent sed ligula at ante tempor posuere a at lorem. </p><br /><p> Aliquam diam felis, vehicula ut ipsum eu, consectetur tincidunt ipsum. Vestibulum sed metus ac nisi tincidunt mollis sed non urna. Vivamus lacinia ullamcorper interdum. Sed sed erat vel leo venenatis pretium. Sed aliquet sem nunc, ut iaculis dolor consectetur et. Vivamus ligula sapien, maximus nec pellentesque ut, imperdiet at libero. Vivamus semper nulla lectus, id dapibus nulla convallis id. Quisque elementum lectus ac dui gravida, ut molestie nunc convallis. Pellentesque et odio non dolor convallis commodo sit amet a ante. </p>'
    );

    const [search, setSearch] = useState<any>('');

    const [filteredItems, setFilteredItems] = useState<any>([]);
    const [AllPosts, setAllPosts] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [postLoading, setPostLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/newsManagement/getAllNews');
            setAllPosts(response.data.result);
        } catch (error) {
            setError("error");
        } finally {
            setLoading(false);
        }
    };
    const postData = async (data: any) => {
        setPostLoading(true)
        try {
            const response = await axios.post('http://localhost:3000/api/newsManagement', data).then((res) => {
                fetchData()
            })
            // setAllPosts(response.data.result);
        } catch (error) {
            setError("error");
        } finally {
            setPostLoading(false);
        }
    };
    const putData = async (data: any) => {
        setPostLoading(true)
        try {
            const response = await axios.put('http://localhost:3000/api/newsManagement/' + data._id, data).then((res) => {
                fetchData()
            })
            // setAllPosts(response.data.result);
        } catch (error) {
            setError("error");
        } finally {
            setPostLoading(false);
        }
    };
    const deletePostsData = async (data: any) => {
        try {
            const response = await fetch(`http://localhost:3000/api/newsManagement/${data._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any other headers if needed, such as authorization headers
                },
            });

            if (response.ok) {
                // File deleted successfully, you may want to update your local state or do other actions.
                console.log('File deleted successfully');
                showMessage('Post Data has been deleted successfully.');

                fetchData();
            } else {
                // Handle errors, you may want to show an error message to the user.
                console.error('Failed to delete file. Response:', response);
            }
        } catch (error) {
            // Handle network errors or other exceptions
            console.error('An error occurred while deleting the file', error);
        }
    };

    useEffect(() => {
        // setLoading(false)
        dispatch(setPageTitle('Dashboard Admin'));

        fetchData();
    }, [dispatch]);

    useEffect(() => {
        setFilteredItems(() => {
            return AllPosts.filter((item: any) => {
                return item.title.toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [search, AllPosts]);

    const saveUser = async () => {
        console.log(params);
        console.log(!params.gallery, !params.gallery, params.gallery.length > 0);

        if (!params.title) {
            showMessage('Title is required.', 'error');
            return true;
        }
        if (!quilvalue) {
            showMessage('Description is required.', 'error');
            return true;
        }

        if (params._id) {
            //update user
            let postObj = {
                title: params.title,
                gallery: params.gallery,
                description: quilvalue,
                coverImage: params.coverImage,
                _id: params._id
            };
            putData(postObj)


        } else {
            if (!(params.gallery.length > 0)) {
                showMessage('Gallery is required.', 'error');
                return true;
            }
            if (!params.coverImage) {
                showMessage('Cover image is required.', 'error');
                return true;
            }

            //add user
            let gallery64 = [];
            let coverImage64 = null;
            if (params.coverImage) {
                coverImage64 = await convertFileToBase64(params.coverImage);
            }
            for (let index = 0; index < params.gallery.length; index++) {
                const element = params.gallery[index];
                let binImage = ''
                binImage = await convertFileToBase64(element);
                gallery64.push(binImage)
            }
            console.log(gallery64, coverImage64, "0000000001");


            let postObj = {
                title: params.title,
                gallery: gallery64,
                description: quilvalue,
                coverImage: coverImage64
            };
            postData(postObj);
            // filteredItems.splice(0, 0, postData);
            //   searchContacts();
        }

        showMessage('User has been saved successfully.');
        setAddContactModal(false);
    };

    const editUser = (user: any = null) => {
        const json = JSON.parse(JSON.stringify(defaultParams));
        setParams(json);
        if (user) {
            let json1 = JSON.parse(JSON.stringify(user));
            setParams(json1);
        }
        setAddContactModal(true);
    };

    const deleteUser = (user: any = null) => {
        deletePostsData(user)
    };

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    const handleSingleFileChange = (e: any) => {
        const file = e.target.files[0];
        // Handle the single file logic
        console.log('Single file:', file);
        setParams({ ...params, ['coverImage']: file });
    };

    const handleMultipleFilesChange = (e: any) => {
        const files = e.target.files;
        // Handle the multiple files logic
        console.log('Multiple files:', files);
        setParams({ ...params, ['gallery']: files });
    };
    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">Post/News Management</h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    <div className="flex gap-3">

                        <div className="relative">
                            <input type="text" placeholder="Search Posts" className="form-input py-2 ltr:pr-11 rtl:pl-11 peer rounded-full" value={search} onChange={(e) => setSearch(e.target.value)} />
                            <button type="button" className="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                                <IconSearch className="mx-auto" />
                            </button>
                        </div>

                        <div>
                            <button type="button" className="btn btn-primary" onClick={() => editUser()}>
                                <IconFolder className="ltr:mr-2 rtl:ml-2" />
                                Add Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {value === 'list' && (
                <div className="mt-5 panel p-0 border-0 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Posted On</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((contact: any) => {
                                    return (
                                        <tr key={contact.id}>
                                            <td>
                                                <div className="flex items-center w-max">


                                                    {/* {!contact.path && !contact.name && (
                                                        <div className="border border-gray-300 dark:border-gray-800 rounded-full p-2 ltr:mr-2 rtl:ml-2">
                                                            <IconUser className="w-4.5 h-4.5" />
                                                        </div>
                                                    )} */}
                                                    <div>{contact.title}</div>
                                                </div>
                                            </td>
                                            <td>{contact.created_at}</td>
                                            <td>
                                                <div className="flex gap-4 items-center justify-center">
                                                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => editUser(contact)}>
                                                        Edit
                                                    </button>
                                                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteUser(contact)}>
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}



            <Transition appear show={addContactModal} as={Fragment}>
                <Dialog as="div" open={addContactModal} onClose={() => setAddContactModal(false)} className="relative z-[51]">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        onClick={() => setAddContactModal(false)}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                        {params._id ? 'Edit File' : 'Add File'}
                                    </div>
                                    <div className="p-5">
                                        <form>
                                            <div className="mb-5">
                                                <label htmlFor="name">Title</label>
                                                <input id="title" type="text" placeholder="Enter Title" className="form-input" value={params.title} onChange={(e) => changeValue(e)} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="address">Description</label>
                                                <ReactQuill theme="snow" value={quilvalue} onChange={setQuilValue} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="ctnFile">Upload File</label>
                                                <input
                                                    id="ctnFile"
                                                    type="file"
                                                    className="form-input rounded-full border-dark file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 ltr:file:mr-5 rtl:file-ml-5 file:text-white file:hover:bg-primary"
                                                    required
                                                    onChange={handleSingleFileChange}

                                                />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="ctnFile">Upload Gallery</label>
                                                <input
                                                    id="ctnFile"
                                                    type="file"
                                                    className="form-input rounded-full border-dark file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 ltr:file:mr-5 rtl:file-ml-5 file:text-white file:hover:bg-primary"
                                                    required
                                                    multiple
                                                    onChange={handleMultipleFilesChange}

                                                />
                                            </div>
                                            <div className="flex justify-end items-center mt-8">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setAddContactModal(false)}>
                                                    Cancel
                                                </button>
                                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={saveUser}>
                                                    {params._id ? 'Update' : 'Add'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default Posts;
