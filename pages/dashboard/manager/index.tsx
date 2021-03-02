import { message } from "antd";
import DetailLayout from "../../../components/layout"
import { getOverview } from "../../../lib/services/api-services"

export default function Manager() {
    const data = getOverview("")
    .then((res) => {
        console.log(res);
    })
    .catch((err) => message.error(err))
    return (
        <DetailLayout>
            <div>Manager Dashboard</div>
        </DetailLayout>
        
    )
}