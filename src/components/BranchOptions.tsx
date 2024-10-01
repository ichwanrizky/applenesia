type Props = {
  userBranch: UserBranch[];
};

type UserBranch = {
  branch: {
    id: number;
    name: string;
  };
};
const BranchOptions = (props: Props) => {
  const { userBranch } = props;
  return (
    <div className="dropdown col-auto mb-2">
      <select className="custom-select">
        {userBranch?.map((item) => (
          <option value="">{item.branch.name?.toUpperCase()}</option>
        ))}
      </select>
    </div>
  );
};

export default BranchOptions;
