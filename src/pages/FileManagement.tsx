import React, { useState, Fragment, useEffect, ChangeEvent } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// ... (Icon imports)
interface File {
    _id: number;
    title: string;
    description: string;
    file: any; // Adjust the type accordingly
}
const FileManagement = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('File Management'));
    });

    const [addContactModal, setAddContactModal] = useState(false);
    const [value, setValue] = useState('list');
    const [defaultParams] = useState({
        _id: null,
        title: '',
        description: '',
        file: null,
    });
    const [params, setParams] = useState(JSON.parse(JSON.stringify(defaultParams)));
    const changeValue = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };
    const [search, setSearch] = useState('');
    const [fileList, setFileList] = useState<File[]>([]);
    const [filteredItems, setFilteredItems] = useState<File[]>([]);
    const [loading, setLoading] = useState(true); // Loading state
    const { fileId } = useParams();

    useEffect(() => {
        console.log('fileList:', fileList);
        setFilteredItems(() => {
            return fileList.filter((item) => {
                return item.title.toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [search, fileList]);
    useEffect(() => {
        // Fetch file list when the component mounts
        fetchFileList();
    }, []);

    const fetchFileList = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/fileManagement/getAllFiles');
            setFileList(response.data.result); // Adjust this line to use response.data directly if needed
            setLoading(false);
        } catch (error) {
            console.error('Error fetching file list:', error);
            setLoading(false);
        }
    };
    

    const saveFile = async () => {
        try {
            if (!params.title || !params.description || !params.file) {
                showMessage('Title, Description, and File are required.', 'error');
                return;
            }
    
            const formData = new FormData();
            formData.append('file', params.file);
            formData.append('title', params.title);
            formData.append('description', params.description);
    
            let response;
            if (params._id) {
                console.log('params._id:', params._id);
                console.log('params.file:', params.file);
    
                console.log('FormData before request:', formData); // Double-check the FormData
    
                response = await axios.put(`http://localhost:3000/api/fileManagement/${params._id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                response = await axios.post('http://localhost:3000/api/fileManagement', formData);
            }
    
            showMessage('File has been saved successfully.');
            setAddContactModal(false);
    
            fetchFileList();
        } catch (error) {
            console.error('Error saving file:', error);
            showMessage('Error saving file.', 'error');
        }
    };
    

    const editFile = (file:any) => {
        const json = JSON.parse(JSON.stringify(defaultParams));
        setParams(json);
        if (file) {
            let json1 = JSON.parse(JSON.stringify(file));
            setParams(json1);
        }
        setAddContactModal(true);
    };

    const deleteFile = async (data: any) => {
        try {
            const response = await fetch(`http://localhost:3000/api/fileManagement/delete/${data._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any other headers if needed, such as authorization headers
                },
            });
    
            if (response.ok) {
                // File deleted successfully, you may want to update your local state or do other actions.
                console.log('File deleted successfully');
                fetchFileList();
            } else {
                // Handle errors, you may want to show an error message to the user.
                console.error('Failed to delete file. Response:', response);
            }
        } catch (error) {
            // Handle network errors or other exceptions
            console.error('An error occurred while deleting the file', error);
        }
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

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">File Management</h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    <div className="flex gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search Files"
                                className="form-input py-2 ltr:pr-11 rtl:pl-11 peer rounded-full"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary"
                            >
                                {/* IconSearch component */}
                            </button>
                        </div>
                        <div>
                        <button type="button" className="btn btn-primary" onClick={() => editFile(null)}>
                            {/* IconFolder component */}
                            Add File
                        </button>
                        </div>
                    </div>
                </div>
            </div>
            {fileList && fileList.length > 0 && (
                <div className="mt-5 panel p-0 border-0 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table-striped table-hover">
                            <thead>
                                <tr>
                                <th>Id</th>
                                    <th>File Name</th>
                                    <th>Description</th>
                                    <th>File</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((data, index) => {
                                    return (
                                        <tr key={index+1}>
                                            <td>{data._id}</td>
                                            <td>{data.title}</td>
                                            <td>{data.description}</td>
                                            <td>{data.file}</td>
                                            <td>
                                                <div className="flex gap-4 items-center justify-center">
                                                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => editFile(data)}>
                                                        Edit
                                                    </button>
                                                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteFile(data)}>
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
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
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
                                        {/* IconX component */}
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                        {params._id ? 'Edit File' : 'Add File'}
                                    </div>
                                    <div className="p-5">
                                        <form>
                                            <div className="mb-5">
                                                <label htmlFor="title">Title</label>
                                                <input
                                                    id="title"
                                                    type="text"
                                                    placeholder="Enter Title"
                                                    className="form-input"
                                                    value={params.title}
                                                    onChange={(e) => changeValue(e)}
                                                />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="address">Description</label>
                                                <textarea
                                                    id="description"
                                                    rows={3}
                                                    placeholder="Enter description"
                                                    className="form-textarea resize-none min-h-[130px]"
                                                    value={params.description}
                                                    onChange={(e) => changeValue(e)}
                                                ></textarea>
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="file">Upload File</label>
                                                <input
                                                    id="file"
                                                    type="file"
                                                    name="file"
                                                    className="form-input rounded-full border-dark file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 ltr:file:mr-5 rtl:file-ml-5 file:text-white file:hover:bg-primary"
                                                    required
                                                    onChange={(e) => {
                                                        const file = e.target.files && e.target.files[0];
                                                        if (file) {
                                                            setParams({ ...params, file: file });
                                                        }
                                                    }}
                                                />
                                                {/* Display the file name */}
                                                {params.file && <p className="text-sm">{params.file.name}</p>}
                                            </div>


                                            <div className="flex justify-end items-center mt-8">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setAddContactModal(false)}>
                                                    Cancel
                                                </button>
                                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={saveFile}>
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

export default FileManagement;
