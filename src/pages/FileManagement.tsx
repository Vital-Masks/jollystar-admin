import React, { useState, Fragment, useEffect, ChangeEvent } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface File {
    _id?: number;
    title?: string;
    description?: string;
    file?: any;
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
        preview: null,
    });
    const [params, setParams] = useState(JSON.parse(JSON.stringify(defaultParams)));
    const [search, setSearch] = useState('');
    const [fileList, setFileList] = useState<File[]>([]);
    const [filteredItems, setFilteredItems] = useState<File[]>([]);
    const [loading, setLoading] = useState(true);
    const { fileId } = useParams();

    useEffect(() => {
        setFilteredItems(() => {
            return fileList.filter((item) => {
                return item.title && item.title.toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [search, fileList]);

    useEffect(() => {
        fetchFileList();
    }, []);

    const fetchFileList = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3000/api/fileManagement/getAllFiles');
            const files = response.data.result || response.data || [];
            // Ensure all files have required properties
            const validFiles = files.map((file: any) => ({
                _id: file._id || null,
                title: file.title || 'Untitled',
                description: file.description || '',
                file: file.file || ''
            }));
            setFileList(validFiles);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching file list:', error);
            showMessage('Failed to fetch files. Please check your connection.', 'error');
            setFileList([]);
            setLoading(false);
        }
    };

    const saveFile = async () => {
        try {
            // For new files, all fields are required
            if (!params._id) {
                if (!params.title || !params.description || !params.file) {
                    showMessage('Title, Description, and File are required for new files.', 'error');
                    return;
                }
            } else {
                // For updates, at least one field should be provided
                if (!params.title && !params.description && !params.file) {
                    showMessage('Please provide at least one field to update.', 'error');
                    return;
                }
            }

            const formData = new FormData();
            
            // Only append fields that have values
            if (params.file) {
                formData.append('file', params.file);
            }
            if (params.title) {
                formData.append('title', params.title);
            }
            if (params.description) {
                formData.append('description', params.description);
            }

            let response;
            if (params._id) {
                response = await axios.put(`http://localhost:3000/api/fileManagement/${params._id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                showMessage('File has been updated successfully.');

            } else {
                response = await axios.post('http://localhost:3000/api/fileManagement', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                showMessage('File has been saved successfully.');
            }

            setAddContactModal(false);
            setParams(JSON.parse(JSON.stringify(defaultParams)));
            fetchFileList();
        } catch (error) {
            console.error('Error saving file:', error);
            showMessage('Error saving file. Please try again.', 'error');
        }
    };

    const editFile = (file: any) => {
        if (file) {
            // Editing existing file
            setParams({
                _id: file._id,
                title: file.title,
                description: file.description,
                file: null, // Reset file input for new selection
                preview: file.file ? `http://localhost:3000/files/${file.file}` : null,
            });
        } else {
            // Adding new file
            setParams(JSON.parse(JSON.stringify(defaultParams)));
        }
        setAddContactModal(true);
    };

    const deleteFile = async (data: any) => {
        try {
            const response = await axios.delete(`http://localhost:3000/api/fileManagement/delete/${data._id}`);
            showMessage('File has been deleted successfully.');
            fetchFileList();
        } catch (error) {
            console.error('An error occurred while deleting the file', error);
            showMessage('Error deleting file. Please try again.', 'error');
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
                            ></button>
                        </div>
                        <div>
                            <button type="button" className="btn btn-primary" onClick={() => editFile(null)}>
                                Add File
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-5 panel p-0 border-0 overflow-hidden">
                <div className="table-responsive">
                    <table className="table-striped table-hover">
                        <thead>
                            <tr>
                                <th>File Name</th>
                                <th>Description</th>
                                <th>File</th>
                                <th></th>
                            </tr>
                        </thead>
                        {loading ? (
                            <tbody>
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                            <span className="ml-2">Loading files...</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        ) : fileList && fileList.length > 0 ? (
                            <tbody>
                                {filteredItems.map((data, index) => {
                                    return (
                                        <tr key={index + 1}>
                                            <td>{data.title || 'Untitled'}</td>
                                            <td>{data.description || 'No description'}</td>
                                            <td>
                                                {data.file ? (
                                                    <a 
                                                        href={`http://localhost:3000/files/${data.file}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:underline"
                                                    >
                                                        {data.file}
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-500">No file</span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="flex gap-4 items-center justify-center">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => editFile(data)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => deleteFile(data)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        ) : <tbody>
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>
                                    No files found
                                </td>
                            </tr>
                        </tbody>}
                    </table>
                </div>
            </div>

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
                                        className="absolute top-[20px] right-[20px] text-gray-500 hover:text-black dark:hover:text-white text-xl"
                                    >
                                        <span className="material-icons">close</span>
                                    </button>
                                    <div className="panel-header border-b p-4">
                                        <h2 className="text-lg font-semibold">
                                            {params._id ? 'Edit File' : 'Add New File'}
                                        </h2>
                                    </div>
                                    <div className="panel-body p-4">
                                        <form>
                                            <div className="mb-4">
                                                <label className="form-label">Title</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={params.title || ''}
                                                    placeholder={params._id ? "Leave empty to keep current title" : "Enter file title"}
                                                    onChange={(e) =>
                                                        setParams((prev: any) => ({ ...prev, title: e.target.value }))
                                                    }
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="form-label">Description</label>
                                                <textarea
                                                    className="form-input"
                                                    value={params.description || ''}
                                                    placeholder={params._id ? "Leave empty to keep current description" : "Enter file description"}
                                                    onChange={(e) =>
                                                        setParams((prev: any) => ({ ...prev, description: e.target.value }))
                                                    }
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="form-label">File
                                                    <span style={{ opacity: "0.5" }}>
                                                        {" "}  ( PDF only)
                                                    </span>
                                                </label>
                                                <input
                                                    type="file"
                                                    className="form-input"
                                                    accept="application/pdf" // Allow only PDF files
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            setParams((prev: any) => ({
                                                                ...prev,
                                                                file: e.target.files![0],
                                                                preview: URL.createObjectURL(e.target.files![0]),
                                                            }));

                                                        }
                                                    }}
                                                />
                                            </div>

                                            {params.preview && (
                                                <div className="mb-4">
                                                    <label className="form-label">Preview</label>
                                                    <div className="border rounded-md p-4 bg-gray-50">
                                                        <iframe
                                                            className="w-full h-auto rounded-md"
                                                            src={params.preview}
                                                            width="100%"
                                                            height="500px"
                                                            title="File Preview"
                                                        ></iframe>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={() => setAddContactModal(false)}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={saveFile}
                                                >
                                                    {params._id ? 'Update' : 'Save'}
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
