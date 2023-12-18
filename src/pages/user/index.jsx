import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../../components/navbar';
import { useEffect, useState } from 'react';
import { fetchUsers } from '../../reducer/userSlice';
import Footer from '../../components/footer';
import { fetchDeleteUser } from '../../reducer/deleteSlice';
import { fetchUpdateUser } from '../../reducer/updateSlice';
import { openModal, closeModal } from '../../reducer/modalSlice';
import Swal from 'sweetalert2';

const User = () => {
  const isOpen = useSelector((state) => state.modal.isOpen);
  const dispatch = useDispatch();

  const [selectedUser, setSelectedUser] = useState(null);
  const [newData, setNewData] = useState({
    name: '',
  });

  const user = useSelector((state) => state.users.user);

  const currentPage = useSelector((state) => state.users.currentPage);
  const totalPages = useSelector((state) => state.users.totalPages);

  console.log('Current Page:', currentPage);
  console.log('Total Pages:', totalPages);
  //status ini untuk status loading
  const status = useSelector((state) => state.users.status);

  //state ini untuk error
  const error = useSelector((state) => state.users.error);

  // suapaya prosesnya langsung tanpa trigger dari button
  useEffect(() => {
    dispatch(fetchUsers(currentPage));
  }, [dispatch, currentPage]);

  //handle previous page
  const handlePrevPage = () => {
    console.log('prev page clicked');
    if (currentPage > 1) {
      dispatch(fetchUsers(currentPage - 1));
    }
  };

  //handle next page
  const handleNextPage = () => {
    console.log(' page clicked');

    if (currentPage < totalPages) {
      dispatch(fetchUsers(currentPage + 1));
    }
  };

  //close modal saat selesai update
  const close = () => {
    dispatch(closeModal());
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setNewData({
      name: user.name,
    });
  };

  //handle delete
  const handleUpdate = async () => {
    try {
      // Periksa apakah ada perubahan
      if (newData.name !== selectedUser.name) {
        await dispatch(fetchUpdateUser({ userId: selectedUser.id, newData }));
        // penutupan modal
        close();
        // Tampilkan alert setelah modal tertutup
        Swal.fire('Sukses!', 'User berhasil diperbarui!', 'success');
      } else {
        // Jika tidak ada perubahan, tampilkan pesan
        Swal.fire('Tidak Ada Perubahan', 'Tidak ada perubahan yang dibuat untuk diperbarui.', 'info');
      }
    } catch (error) {
      // Tangani kesalahan
      console.error('Error updating user:', error);
      // Tampilkan pesan kesalahan
      Swal.fire('Update Failed!', 'An error occurred while updating user.', 'error');
    }
  };

  // handle modal open dan close modal
  const handleOpen = () => {
    console.log('buka', isOpen);
    dispatch(openModal());
  };

  const handleClose = () => {
    console.log('tutup', isOpen);
    dispatch(closeModal());
  };

  //untuk handle delete
  const handleDeleteClick = (userId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this user!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete it',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d9534f',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        // Menunggu dispatch selesai sebelum menampilkan pesan deleted
        await dispatch(fetchDeleteUser(userId));
        // Menampilkan pesan setelah berhasil menghapus
        Swal.fire('Deleted!', 'The user has been deleted.', 'success');
      },
    });
  };

  return (
    <div>
      <Navbar />
      {status === 'loading' && (
        <div className="mt-20 m-auto flex items-center justify-center w-56 h-56 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      {status === 'failed' && <p>Error : {error}</p>}
      {status === 'succeeded' && (
        <div className="container mx-auto mt-24">
          {/* pagination */}
          <nav aria-label="Page navigation example">
            <ul className="inline-flex -space-x-px text-base h-10">
              <li>
                <button
                  type="button"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  Previous
                </button>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  {currentPage} of {totalPages}
                </a>
              </li>

              <li>
                <button
                  href=""
                  type="button"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>

          <div className="grid grid-cols-3 gap-2 mt-4">
            {user.map((item) => (
              <div
                key={item.id}
                className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-3"
              >
                <div className="flex flex-col items-center pb-10 pt-4">
                  <img
                    className="w-24 h-24 mb-3 rounded-full shadow-lg"
                    src={item.avatar}
                    alt="Bonnie image"
                  />
                  <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{item.first_name}</h5>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{item.email}</span>
                  <div className="flex mt-4 md:mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        handleOpen();
                        handleEditClick(item);
                      }}
                      data-modal-target="popup-modal"
                      data-modal-toggle="popup-modal"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(item.id)}
                      type="button"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-red-800 dark:text-white dark:border-red-800 dark:hover:bg-red-700 dark:hover:border-red-700 dark:focus:ring-gray-700 ms-3"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* modal delete */}
      {isOpen && (
        <>
          <div
            id="popup-modal"
            tabIndex="-1"
            aria-hidden="true"
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center"
          >
            <div className="absolute p-4 w-full max-w-2xl h-full md:h-auto">
              {/* Modal content */}
              <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                {/* Modal header */}
                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Update User</h3>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-toggle="updateProductModal"
                  >
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                {/* Modal body */}
                <div>
                  <div className="grid gap-4 mb-4 sm:grid-cols-1">
                    <div>
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={newData.name}
                        onChange={(e) => setNewData({ ...newData, name: e.target.value })}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Ex. Jonh doe"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="brand"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Job
                      </label>
                      <input
                        type="text"
                        name="brand"
                        id="brand"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Ex. Apple"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      type="submit"
                      onClick={handleUpdate}
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      disabled={status === 'loading'}
                    >
                      {status === 'loading' ? 'Loading..' : 'Update User'}
                    </button>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <Footer />
    </div>
  );
};

export default User;
