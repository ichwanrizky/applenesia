type Props = {
  userBranch: UserBranch[];
  role?: string;
  setBranchAccess: (value: string) => void;
};

type UserBranch = {
  branch: {
    id: number;
    name: string;
  };
};
const BranchOptions = (props: Props) => {
  const { userBranch, role, setBranchAccess } = props;
  return (
    <div className="dropdown col-auto mb-2">
      <select
        className="custom-select"
        onChange={(e) => setBranchAccess(e.target.value)}
      >
        {role === "ADMINISTRATOR" ? (
          <>
            <option value="all">SEMUA CABANG</option>
            {userBranch?.map((item, index) => (
              <option value={item.branch.id} key={index}>
                {item.branch.name?.toUpperCase()}
              </option>
            ))}
          </>
        ) : (
          userBranch?.map((item, index) => (
            <option value={item.branch.id} key={index}>
              {item.branch.name?.toUpperCase()}
            </option>
          ))
        )}
      </select>
    </div>
  );
};

export default BranchOptions;
