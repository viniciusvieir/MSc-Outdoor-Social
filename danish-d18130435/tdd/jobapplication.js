function JobApplicant() {
    this.processApplication = (jobApplicant) => {
        if (jobApplicant.experienceInYears >= 3 && jobApplicant.industry === "hospitality" && jobApplicant.bachelorsDegree === true) {
            return "HIRE";
        }else if (jobApplicant.experienceInYears == 3 && jobApplicant.industry === "hospitality" && jobApplicant.bachelorsDegree === false) {
            return "MAYBE";
        }else if (jobApplicant.experienceInYears <= 3 && jobApplicant.industry === "hospitality" && jobApplicant.bachelorsDegree === false) {
            return "NO";
        }
    }
}
module.exports = new JobApplicant();

