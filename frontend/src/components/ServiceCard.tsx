const ServiceCard = ({ service, onDelete, onEdit }: any) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-md">

      <h3 className="text-lg font-bold">{service.title}</h3>
      <p className="text-gray-600">{service.description}</p>

      <div className="flex gap-2 mt-4">
        <button
          onClick={onEdit}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Edit
        </button>

        <button
          onClick={onDelete}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>

    </div>
  );
};

export default ServiceCard;