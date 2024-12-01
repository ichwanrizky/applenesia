import { authOptions } from "@/libs/AuthOptions";
import InvoicePage from "@/pages/invoice/InvoicePage";
import { getServerSession } from "next-auth";

type Session = {
  user: UserSession;
};
type UserSession = {
  name: string;
  id: number;
  username: string;
  role_id: number;
  role_name: string;
  accessToken: string;
  userBranch: any;
};

export default async function Invoice() {
  const session = (await getServerSession(authOptions)) as Session | null;

  if (!session) {
    return null;
  }

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0 font-size-18">Data Invoice</h4>
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="#">Point Of Sales</a>
                  </li>
                  <li className="breadcrumb-item active">Data Invoice</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <InvoicePage session={session.user} />
      </div>
    </div>
  );
}
