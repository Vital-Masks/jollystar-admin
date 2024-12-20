import React, { useState, Fragment, useEffect, ChangeEvent } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import axios from 'axios';

const DeclineMemberReason = ({ hableRemove, removeLoading,memberID }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Remove Member Reason'));
    }, [dispatch]);

    const [addReasonModal, setAddReasonModal] = useState(false);
    const [reason, setReason] = useState('');

    const saveReason = async () => {
        try {
            if (!reason.trim()) {
                showMessage('Reason is required.', 'error');
                return;
            }
            try {
                hableRemove(reason)
                setAddReasonModal(false);
                setReason('');
            } catch (error) {
                showMessage('Failed to save reason.', 'error');

            }


        } catch (error) {
            console.error('Error saving reason:', error);
            showMessage('Error saving reason.', 'error');
        }
    };

    const showMessage = (msg = '', type = 'success') => {
        const toast = Swal.mixin({
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
const clickDecline =()=>{
    if(!memberID){

        return;
    }else{
        setAddReasonModal(true)
    }
}
    return (
        <div>
                <button onClick={clickDecline} type="button"  className="btn btn-outline-danger rounded-full text-2xl">
                    {removeLoading ? 'Loading ...' : " Decline" }
                    {/* removeLoading */}
                    
                </button>


            <Transition appear show={addReasonModal} as={Fragment}>
                <Dialog as="div" open={addReasonModal} onClose={() => setAddReasonModal(false)} className="relative z-[51]">
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
                                        onClick={() => setAddReasonModal(false)}
                                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                    >
                                        &times;
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] pl-5 py-3 pr-10">
                                        Add Reason for Removal
                                    </div>
                                    <div className="p-5">
                                        <form>
                                            <div className="mb-5">
                                                <label htmlFor="reason">Reason</label>
                                                <textarea
                                                    id="reason"
                                                    rows={3}
                                                    placeholder="Reason for removing the member"
                                                    className="form-textarea resize-none min-h-[130px]"
                                                    value={reason}
                                                    onChange={(e) => setReason(e.target.value)}
                                                ></textarea>
                                            </div>
                                            <div className="flex justify-end items-center mt-8">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setAddReasonModal(false)}>
                                                    Cancel
                                                </button>
                                                <button type="button" className="btn btn-primary ml-4" onClick={saveReason}>
                                                   Decline
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

export default DeclineMemberReason;
