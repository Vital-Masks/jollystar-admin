import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import Tippy from '@tippyjs/react';
import React, { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconUsersGroup from '../../components/Icon/IconUsersGroup';
import IconThumbUp from '../../components/Icon/IconThumbUp';
import IconTrash from '../../components/Icon/IconTrash';
import IconFolderPlus from '../../components/Icon/IconFolderPlus';
import IconNotesEdit from '../../components/Icon/IconNotesEdit';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
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
import axios from 'axios';
import Popover from '@mui/material/Popover';
import ViewAllStatusMember from '../../components/memberShip/viewAllMemberDatas';
interface PaymentDetail {

    memberId?: string;
    bank?: string;
    branch?: string;
    total?: string;
    date?: string;
    paymentSlip?: string;
}
interface Member {
    data: Member | (() => Member);
    paymentDetails?: PaymentDetail[];
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
interface FormValues {
    isSchoolDetailVerified: boolean;
    isPaymentDetailVerified: boolean;
}
const ViewAllMemberProfile: React.FC<Member> = ({ data }) => {

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    // 
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const [members, setMembers] = useState<Member>(data);
    const { memberId } = useParams();
    const [isSclChecked, setIsSclChecked] = useState(true);
    const [ispayChecked, setIsPayChecked] = useState(true);

    const [removeLoading, setRemoveLoading] = useState(false)
    const [approveLoading, setApproveLoading] = useState(false)
    const [memberIdErrorMsg, setMemberIdErrorMsg] = useState("")

    const [formValues, setFormValues] = useState<FormValues>({
        isSchoolDetailVerified: isSclChecked,
        isPaymentDetailVerified: ispayChecked,
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'memberID') {
            setMemberIdErrorMsg("")

        }
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };
    const handleSchoolCheckboxChange = () => {
        console.log(formValues.isPaymentDetailVerified);
        setIsSclChecked(!isSclChecked)
        setFormValues((prevValues) => ({
            ...prevValues,
            isSchoolDetailVerified: !isSclChecked,
        }));
    };
    const handlePaymentCheckboxChange = () => {
        setIsPayChecked(!ispayChecked)
        setFormValues((prevValues) => ({
            ...prevValues,
            isPaymentDetailVerified: !ispayChecked,
        }));
    };

  

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
    const hableRemove = () => {

        setRemoveLoading(true);
        handleStatus("REMOVED")

    }
    const handleStatus = async (status: string) => {
        let data = {
            "memberApprovalStatus": status.toUpperCase(),
            "declinedMessage": "wrong info"
        }
        console.log(status);
        try {

            const response = await axios.put(`http://localhost:3000/api/member/memberApproval/${memberId}`, data
            );
            // Handle the response as needed
            console.log('PUT request successful:', response.data);
            alertForm1("Sucessfully " + status, "")
            navigate(-1);

        } catch (error) {
            // Handle errors
            console.error('Error:', error);
            alertForm1(status + " Failed", "error")
        } finally {
            setRemoveLoading(false)
        }

    }

    const alertForm1 = (msg: string, error: string) => {

        const toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
        });
        toast.fire({
            icon: error === "error" ? "error" : "success",
            title: msg,
            padding: '10px 20px',
        });
    };
    return (
        <div className="max-w-[60rem] w-full bg-[#e2e2e7] shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none" style={{ borderRadius: '30px' }}>
            <div className="p-5 sm:p-10 flex flex-col sm:flex-row items-center">
                <div className="w-60 h-60 rounded-md overflow-hidden object-cover mb-5 sm:mb-0">
                    <img
                        src={`data:image/png;base64,${members?.profilePicture}`}
                        alt="profile"
                        className="w-full h-full object-cover"
                        style={{ borderRadius: '30px', maxWidth: '100%', maxHeight: '300px' }}
                    />
                </div>
                <div className="text-center sm:text-left ml-10 mr-5">
                    <h3 className="text-[#3b3f5c] text-2xl sm:text-4xl font-semibold mb-2 dark:text-black bold">
                        {members?.firstName} {members?.lastName}
                    </h3>
                    <p className="mb-2 text-lg sm:text-xl text-dark">
                        Membership Type - {members?.membershipCategory}
                    </p>
                    <p className="mb-2 text-lg sm:text-xl text-dark">
                        Status - {members?.memberApprovalStatus}
                    </p>
                    <p className="mb-2 text-lg sm:text-xl text-dark">
                        Member Request - {members?.created_at}
                    </p>
                    <p className="mb-2 text-lg sm:text-xl text-dark">
                        Membership Approval Date - {members?.updated_at}
                    </p>
                    <p className="mb-2 text-lg sm:text-xl text-dark">
                        Membership ID - {members?.membershipId}
                    </p>
                </div>
            </div>
        </div>




    );
};

export default ViewAllMemberProfile;
