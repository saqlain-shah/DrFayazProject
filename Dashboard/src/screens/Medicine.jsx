import React, { useState, useEffect } from 'react';
import { MdOutlineCloudDownload } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import { BiChevronDown, BiPlus } from 'react-icons/bi';
import Layout from '../Layout';
import { Button, Select } from '../components/Form';
import { MedicineTable } from '../components/Tables';
import AddEditMedicineModal from '../components/Modals/AddEditMedicine';
import { sortsDatas } from '../components/Datas';

function Medicine() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [status, setStatus] = useState(sortsDatas.stocks[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedStockStatus, setSelectedStockStatus] = useState('All'); // Initialize with 'All'

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');

      let response = await fetch(`${BASE_URL}/api/medicine`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      let responseData = await response.json();

      let filtered = responseData;
      if (selectedStockStatus !== 'All') {
        filtered = responseData.filter(item => (item.inStock && selectedStockStatus === 'In Stock') || (!item.inStock && selectedStockStatus === 'Out of Stock'));
      }
      setData(responseData);
      setFilteredData(filtered);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    }
  };


  useEffect(() => {
    fetchData();
  }, [selectedStockStatus]); // Fetch data when selected stock status changes

  useEffect(() => {
    const filtered = data.filter(item =>
      item.medicineName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [data, searchTerm]);

  const onCloseModal = async () => {
    setIsOpen(false);
    setSelectedItem(null);
    await fetchData();
  };

  const onDelete = async (item) => {
    try {
      const response = await fetch(`${BASE_URL}/api/medicine/${item._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      fetchData();
      toast.success('Medicine deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete medicine');
    }
  };

  const onEdit = async (item) => {
    setIsOpen(true);
    setSelectedItem(item);
  };

  return (
    <Layout>
      {isOpen && (
        <AddEditMedicineModal
          isOpen={isOpen}
          closeModal={onCloseModal}
          onClose={onCloseModal}
          selectedItem={selectedItem}
        />
      )}

      <button
        onClick={() => setIsOpen(true)}
        className="w-16 animate-bounce h-16 border border-border z-50 bg-subMain text-white rounded-full flex-colo fixed bottom-8 right-12 button-fb"
      >
        <BiPlus className="text-2xl" />
      </button>

      <h1 className="text-xl font-semibold">Medicine</h1>
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="100"
        data-aos-offset="200"
        className="bg-white my-8 rounded-xl border-[1px] border-border p-5"
      >
        <div className="grid md:grid-cols-6 grid-cols-1 gap-2">
          <div className="md:col-span-5 grid lg:grid-cols-4 xs:grid-cols-2 items-center gap-2">
            <input
              type="text"
              placeholder='Search "paracetamol"'
              className="h-14 w-full text-sm text-main rounded-md bg-dry border border-border px-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Select
              selectedPerson={status}
              setSelectedPerson={setStatus}
              datas={sortsDatas.stocks}
            >
              <div className="w-full relative">
                <div className="w-full flex-btn text-main text-sm p-4 border bg-dry border-border font-light rounded-lg cursor-pointer">
                  {status.name} <BiChevronDown className="text-xl ml-1" />
                </div>
                <div className="absolute z-10 top-full left-0 w-full bg-white border border-gray-300 shadow-md rounded-b-lg">
                  {sortsDatas.stocks.map((item, index) => (
                    <div
                      key={index}
                      className={`p-2 cursor-pointer hover:bg-gray-100 ${status === item ? 'bg-gray-100' : ''
                        }`}
                      onClick={() => setStatus(item)}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
            </Select>
          </div>

          <Button
            label="Export"
            Icon={MdOutlineCloudDownload}
            onClick={() => {
              toast.error('Exporting is not available yet');
            }}
          />
        </div>
        <div className="mt-8 w-full overflow-x-scroll">
          <MedicineTable data={filteredData} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>
    </Layout>
  );
}

export default Medicine;
