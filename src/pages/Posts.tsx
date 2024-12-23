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
import { formatDate } from '../utils/utils';


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
        "");

    const [search, setSearch] = useState<any>('');

    const [filteredItems, setFilteredItems] = useState<any>([]);
    const [AllPosts, setAllPosts] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [postLoading, setPostLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [coverImage64New, setCoverImage64New] = useState<string | null>(null);
    const [gallery64Previews, setGallery64Previews] = useState([]);

    // const [error, setError] = useState<string | null>(null);

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
            let coverImage64 = params.coverImage;
            let gallery64 = [];
            gallery64 = params.gallery

            if (params.coverImage instanceof File) {
                try {
                    coverImage64 = await convertFileToBase64(params.coverImage);
                    // setCoverImage64New(coverImage64);
                } catch (error) {
                    console.error('Error converting file to Base64:', error);
                }
            } else {
                coverImage64 = params.coverImage;
            }
            if (params.gallery instanceof File) {
                try {
                    for (let index = 0; index < params.gallery.length; index++) {
                        const element = params.gallery[index];
                        let binImage = ''
                        binImage = await convertFileToBase64(element);
                        gallery64.push(binImage)
                    }
                } catch (error) {
                    console.error('Error converting file to Base64:', error);
                }
            } else {
                gallery64 = params.gallery
            }


            let postObj = {
                title: params.title,
                gallery: gallery64,
                description: quilvalue,
                coverImage: coverImage64,
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
            gallery64 = params.gallery
            let coverImage64 = params.coverImage;
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
            setQuilValue(json1.description)
            setCoverImage64New(json1.coverImage)
            setGallery64Previews(json1.gallery)
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

    const handleSingleFileChange = async (e: any) => {
        const file = e.target.files[0];
        let coverImage64 = ""
        if (file instanceof File) {
            try {
                coverImage64 = await convertFileToBase64(file);
                // setCoverImage64New(coverImage64);
            } catch (error) {
                console.error('Error converting file to Base64:', error);
            }
        }
        // Handle the single file logic
        setParams({ ...params, ['coverImage']: coverImage64 });
    };

    const handleMultipleFilesChange = async (e: any) => {
        if (!e.target.files) return; // Ensure there are files selected
        const files = e.target.files;
        let gallery64: string[] = [];
        if (files instanceof FileList) {
            for (const file of files) {
                try {
                    const coverImage = await convertFileToBase64(file);
                    gallery64.push(coverImage);
                } catch (error) {
                    console.error('Error converting file to Base64:', error);
                }
            }
        } else {
            console.error('Input is not a FileList.');
        }
        setParams({ ...params, ['gallery']: gallery64 });
    };
    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">News Management</h2>
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
                                                    <div>{contact.title}</div>
                                                </div>
                                            </td>
                                            <td>{formatDate(contact.created_at)}</td>
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
                                        {params._id ? 'Edit News Management' : 'Add News Management'}
                                    </div>
                                    <div className="p-5">
                                        <form>
                                            <div className="mb-5">
                                                <label htmlFor="name">Title   <span style={{ opacity: "0.5" }}>
                                                    {" "}  ( Max 35 letters)
                                                </span></label>
                                                <input id="title" type="text" placeholder="Enter Title" className="form-input" maxLength={35} value={params.title} onChange={(e) => changeValue(e)} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="address">Description</label>
                                                <ReactQuill theme="snow" value={quilvalue} onChange={setQuilValue} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="ctnFile">Upload File <span style={{ opacity: "0.5" }}>
                                                    {" "}  ( 250px X 360px)
                                                </span> </label>
                                                <input
                                                    id="ctnFile"
                                                    type="file"
                                                    className="form-input rounded-full border-dark file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 ltr:file:mr-5 rtl:file-ml-5 file:text-white file:hover:bg-primary"
                                                    required
                                                    onChange={handleSingleFileChange}

                                                />
                                            </div>
                                            <div className="mb-5">
                                                {/* <label htmlFor="ctnFile">Single File Preview</label> */}
                                                {params.coverImage && (
                                                    <img
                                                        src={"data:image/png;base64," + params.coverImage}

                                                        // src={params.coverImage}
                                                        alt="Preview"
                                                        className="w-40 h-40 object-cover rounded mt-3"
                                                    />
                                                )}

                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="ctnFile">Upload Gallery  <span style={{ opacity: "0.5" }}>
                                                    {" "}  ( 250px X 360px)
                                                </span></label>
                                                <input
                                                    id="ctnFile"
                                                    type="file"
                                                    className="form-input rounded-full border-dark file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 ltr:file:mr-5 rtl:file-ml-5 file:text-white file:hover:bg-primary"
                                                    required
                                                    multiple
                                                    onChange={handleMultipleFilesChange}

                                                />
                                            </div>
                                            {params.gallery && params.gallery.length > 0 && params.gallery.map((preview, index) => (
                                                <img
                                                    src={"data:image/png;base64," + preview}
                                                    alt="Preview"
                                                    className="w-40 h-40 object-cover rounded mt-3"
                                                />

                                            ))}
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
