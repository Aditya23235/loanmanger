import connectToDatabase from "./src/lib/mongodb";
import LoanApplication from "./src/models/LoanApplication";

async function checkId() {
    try {
        await connectToDatabase();
        const id = "69a916d5f2d703d6fcd998a3";
        console.log("Checking ID:", id);
        const byId = await LoanApplication.findById(id);
        console.log("By FindById:", byId ? "Found" : "Not Found");
        const byApplicantId = await LoanApplication.findOne({ applicantId: id });
        console.log("By ApplicantId:", byApplicantId ? "Found" : "Not Found");
    } catch (e) {
        console.error("Error:", e);
    }
    process.exit();
}

checkId();
