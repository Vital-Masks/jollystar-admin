import React, { useState, Fragment, useEffect, ChangeEvent } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface File {
    _id: number;
    title: string;
    description: string;
    file: any;
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
                return item.title.toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [search, fileList]);

    useEffect(() => {
        fetchFileList();
    }, []);

    const fetchFileList = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/fileManagement/getAllFiles');
            setFileList(response.data.result);
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
                response = await axios.put(`http://localhost:3000/api/fileManagement/${params._id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                showMessage('File has been updated successfully.');

            } else {
                response = await axios.post('http://localhost:3000/api/fileManagement', formData);
                showMessage('File has been saved successfully.');
            }

            setAddContactModal(false);
            fetchFileList();
        } catch (error) {
            console.error('Error saving file:', error);
            showMessage('Error saving file.', 'error');
        }
    };

    const editFile = (file: any) => {
        const json = JSON.parse(JSON.stringify(defaultParams));
        setParams(json);
        if (file) {
            let json1 = JSON.parse(JSON.stringify(file));
            setParams({ ...json1, preview: json1.file });
        }
        setAddContactModal(true);
    };

    const deleteFile = async (data: any) => {
        try {
            const response = await fetch(`http://localhost:3000/api/fileManagement/delete/${data._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                fetchFileList();
            } else {
                console.error('Failed to delete file. Response:', response);
            }
        } catch (error) {
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
                        {fileList && fileList.length > 0 ? (
                            <tbody>
                                {filteredItems.map((data, index) => {
                                    return (
                                        <tr key={index + 1}>
                                            <td>{data.title}</td>
                                            <td>{data.description}</td>
                                            <td>{data.file}</td>
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
                                <td colSpan={12} style={{ textAlign: 'center' }}>
                                    No data
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
                                                    value={params.title}
                                                    onChange={(e) =>
                                                        setParams((prev) => ({ ...prev, title: e.target.value }))
                                                    }
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="form-label">Description</label>
                                                <textarea
                                                    className="form-input"
                                                    value={params.description}
                                                    onChange={(e) =>
                                                        setParams((prev) => ({ ...prev, description: e.target.value }))
                                                    }
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="form-label">File
                                                    <span style={{ opacity: "0.5" }}>
                                                        {" "}  ( Pdf only)
                                                    </span></label>
                                                <input
                                                    type="file"
                                                    className="form-input"
                                                    accept="application/pdf" // Allow only PDF files
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            setParams((prev) => ({
                                                                ...prev,
                                                                file: e.target.files[0],
                                                                preview: URL.createObjectURL(e.target.files[0]),
                                                            }));

                                                        }
                                                    }}
                                                />
                                            </div>

                                            {params.preview && (
                                                <div className="mb-4">
                                                    <label className="form-label">Preview</label>
                                                    <iframe
                                                        className="w-full h-auto rounded-md"
                                                        src={
                                                            params.preview.startsWith('blob:')
                                                                ? params.preview
                                                                : `http://localhost:3000/files/${params.preview}`
                                                        }
                                                        width="100%"
                                                        height="500px"
                                                    ></iframe>
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
