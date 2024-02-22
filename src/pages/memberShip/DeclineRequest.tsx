import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import Tippy from '@tippyjs/react';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconUsersGroup from '../../components/Icon/IconUsersGroup';
import IconThumbUp from '../../components/Icon/IconThumbUp';
import IconTrash from '../../components/Icon/IconTrash';
import IconFolderPlus from '../../components/Icon/IconFolderPlus';
import IconNotesEdit from '../../components/Icon/IconNotesEdit';
import { Link, NavLink, useParams } from 'react-router-dom';
import IconPlus from '../../components/Icon/IconPlus';
import IconHome from '../../components/Icon/IconHome';
import IconDollarSignCircle from '../../components/Icon/IconDollarSignCircle';
import IconPhone from '../../components/Icon/IconPhone';
import IconLinkedin from '../../components/Icon/IconLinkedin';
import IconTwitter from '../../components/Icon/IconTwitter';
import IconFacebook from '../../components/Icon/IconFacebook';
import IconGithub from '../../components/Icon/IconGithub';
import IconUser from '../../components/Icon/IconUser';
import IconLaptop from '../../components/Icon/IconLaptop';
import IconPlayCircle from '../../components/Icon/IconPlayCircle';
import IconAt from '../../components/Icon/IconAt';
import Swal from 'sweetalert2';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper';
import themeConfig from '../../theme.config';
import IconEdit from '../../components/Icon/IconEdit';
import ViewAllStatusMember from '../../components/memberShip/viewAllMemberDatas';
import ViewAllMemberProfile from './ViewAllMemberProfile';

interface Member {
    _id: string;
    profilePicture: object;
    firstName?: string;
    lastName?: string;
    membershipCategory: string;
    updated_at: string;
    passportNumber: string;
    phoneNumber: string;
    memberApprovalStatus: string;
    title?: string;
    dateOfBirth?: string;
    email?: string;
    userName?: string;
    password?: string;
    telephoneNumber?: string;
    address?: string;
    maritalStatus?: string;
    workPlaceName?: string;
    occupation?: string;
    officeAddress?: string;
    schoolDetails?: SchoolDetail[];
    clubDetails?: ClubDetail[];
    gallery?: GalleryItem[];
    isSchoolDetailVerified?: boolean;
    isPaymentDetailVerified?: boolean;
    membershipId?: string;
    declinedMessage?: string;
    created_at?: string;
}

interface SchoolDetail {
    schoolName?: string;
    participated?: string;
    game?: string;
    from?: string;
    to?: string;
    role?: string;
}

interface ClubDetail {
    clubName?: string;
    involved?: string;
    game?: string;
    from?: string;
    to?: string;
    role?: string;
}

interface GalleryItem {
    // Define the properties of your gallery item
}

const DeclineRequest = () => {
    const dispatch = useDispatch();
    const [members, setMembers] = useState<Member>();
    const { memberId } = useParams();



    useEffect(() => {
        dispatch(setPageTitle('Approved Members'));

        fetch(`http://localhost:3000/api/member/memberPayment/${memberId}`)
            .then(response => response.json())
            .then(data => {
                if (data.result) {
                    setMembers(data.result[0]);
                }
            })
            .catch(error => console.error('Error fetching data:', error));

    }, [dispatch, memberId]);

    const [tabs, setTabs] = useState('home');

    const toggleTabs = (name: string) => {
        setTabs(name);
    };

    const items = ['carousel1.jpeg', 'carousel2.jpeg', 'carousel3.jpeg'];

    const tableData = [
        {
            id: 1,
            firstname: 'John',
            lastname: 'Doe',
            membershiptype: 'johndoe',
            dateapplied: '10/08/2020',
            nic: '954646466V',
            mobile: '073777777777',
        }
    ];

    return (
        <div className="mb-5 space-y-5">

            <div className="sm:flex-1 ltr:sm:ml-0 ltr:ml-auto sm:rtl:mr-0 rtl:mr-auto flex flex-col sm:flex-row items-center space-x-1.5 lg:space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]">
                <div className="sm:ltr:mr-auto sm:rtl:ml-auto">
                    <div className="space-y-2 prose dark:prose-headings:text-white-dark mt-10 mb-10">
                        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
                            Declined Membership Requests
                        </h1>
                    </div>
                </div>
            </div>

            <div className="flex flex-col space-y-5 sm:flex-row sm:space-y-0 sm:space-x-5">
                {
                    members &&
                    <ViewAllMemberProfile data={members} />
                }
                {members && <div className="max-w-[40rem] w-full bg-[#e2e2e7] shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none" style={{ borderRadius: '30px' }}>
                    <div className="p-5 sm:p-10 flex flex-col sm:flex-row items-center">
                        <div className="text-center sm:text-left mr-5">
                            <h3 className="text-[#3b3f5c] text-2xl sm:text-4xl font-semibold mb-2 dark:text-black bold">
                                Verification Process
                            </h3>

                            <label className="inline-flex mt-5 text-xl">
                                <span className="peer-checked:text-success">School and Club Details</span>
                                <input type="checkbox" value={members?.isSchoolDetailVerified?.toString()} className="form-checkbox text-success border-white peer ml-5" />
                            </label>
                            <label className="inline-flex mt-5 ml-10 text-xl">
                                <span className="peer-checked:text-success">Payment Details</span>
                                <input type="checkbox" value={members?.isPaymentDetailVerified?.toString()} className="form-checkbox text-success border-white peer ml-5" />
                            </label>
                            <form className="space-y-5 mt-5">
                                <div className="sm:flex justify-between items-center md:gap-20">
                                    <label htmlFor="hrLargeinput" className="w-full sm:w-auto text-2xl">Membership Id</label>
                                    <input id="hrLargeinput" type="text" value={members?.membershipId} className="w-full sm:w-1/2 form-input text-2xl" />
                                </div>
                            </form>

                            <div className="flex mt-5 ml-5 justify-center">
                                <button className="btn btn-danger rounded-full text-2xl">Declined Application</button>
                            </div>

                        </div>
                    </div>
                </div>}
            </div>


            {/* Body Start */}
            {
                members &&
                <ViewAllStatusMember data={members} />
            }

            {/* Body End */}







        </div>




    );
};

export default DeclineRequest;
