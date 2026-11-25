require("dotenv").config();
const mongoose = require("mongoose");
const Section = require("./models/Section");

const DATA = [
  
   {
  title: "Abstract",
  content: `Non-governmental organizations (NGOs) play a central role in delivering food, medical, educational, and financial assistance to vulnerable individuals and families. In practice, however, each organization maintains its beneficiary information separately, in paper registers, spreadsheets, or stand-alone databases. Because these records are never shared, an NGO has no dependable way to find out whether an applicant has already been helped by another organization. This fragmentation leads to duplicate assistance to the same person or household, repeated manual verification effort, inefficient use of limited donor funds, and deserving families who remain unidentified. Manual cross-checking between organizations is slow, depends on personal contacts, and does not scale.

This project presents AidSync, a secure, web-based Centralized NGO Beneficiary Verification and Assistance Coordination System for participating NGOs. AidSync provides a single shared database in which authorized organizations can register beneficiaries, record family members and assistance details, and search for existing records using CNIC, phone number, name, address, postal code, and family information. NGO accounts are provisioned and verified by a system administrator, so the public cannot register or view any beneficiary data. Every record is automatically tagged with the unique NGO ID and name of the logged-in organization, which prevents staff from entering or altering the source organization manually.

The core contribution of the project is its matching engine. Searches and new registrations pass through a four-stage pipeline: normalization of names, addresses, phone numbers, and CNICs; blocking, which uses indexed SQL queries to retrieve a small set of plausible candidate records; scoring, which combines deterministic rules (exact CNIC and phone match) with fuzzy string similarity (Jaro-Winkler, token-based, and phonetic comparison) for names, addresses, and family members; and classification into Exact Match, Strong Potential Match, or Possible Related Household. Each result carries a confidence score and a plain-language list of reasons, together with the previous NGO, NGO ID, and the date of earlier assistance. The system deliberately never labels a person as fraudulent and never rejects assistance automatically. It raises an alert only, and the NGO performs its own physical verification and takes the final decision.

The system follows a three-tier architecture. The frontend is built with React.js, HTML5, CSS3, JavaScript, and Tailwind CSS or Bootstrap. The backend is developed in Python using the FastAPI framework, which exposes RESTful APIs with automatic request validation and OpenAPI documentation, and which gives direct access to Python similarity libraries such as RapidFuzz and Jellyfish. Data is stored in MySQL and accessed through SQLAlchemy. Security is addressed through JWT-based authentication, bcrypt password hashing, role-based access control, hashed and encrypted storage of sensitive identifiers, masking of other organizations' personal data, HTTPS, and audit logging of logins, searches, and record changes. The assistance date entered by the NGO is stored separately from the system-generated record creation date, so that historical assistance can be entered accurately.

The project follows an incremental development methodology across nine phases, from requirement analysis and design to authentication, beneficiary management, search and matching, reporting, historical data evaluation, testing, and deployment. The system will be evaluated using anonymized or synthetic beneficiary data with injected duplicates, spelling variations, and household relations. Matching quality will be measured by precision, recall, and F1 score, and the system will also be assessed through functional, security, usability, and performance testing.

AidSync is expected to reduce duplicate assistance, shorten verification time, and improve coordination among NGOs, while keeping beneficiary privacy and human judgment at the centre of the process. Beyond the software itself, the project contributes an explainable, lightweight approach to cross-organization verification that small and medium NGOs can adopt without expensive infrastructure.

Keywords: NGO, beneficiary verification, duplicate detection, record linkage, fuzzy matching, household matching, FastAPI, React, MySQL, JWT, aid coordination.`,
  order: 1
},
  {
    title: "Literature Review",
    content: `<b>Introduction</b>
This chapter critically reviews the academic literature, industry practice, and technical standards that underpin AidSync. Its purpose is threefold: to establish that duplicated assistance is a genuine coordination problem for NGOs, to evaluate how far existing systems and research already address it, and to justify the techniques and technologies selected for the proposed solution. The review is organized thematically. It begins with beneficiary information management and aid coordination, then examines existing software, then the science of record linkage (matching, blocking, and household detection), and finally the privacy, security, and technology considerations that shape the design. The chapter closes with a critical analysis that identifies the research gap.
<b>Review Approach</b>
Sources were drawn from foundational record-linkage research (statistics and database literature), surveys of duplicate detection and entity resolution, humanitarian data-protection guidance, web-security standards, and the official documentation of the technologies used. Product information for existing systems was taken from their publicly described purposes. Each theme is discussed in terms of what is known, what its limitations are, and what it implies for AidSync.
<b>Beneficiary Information Management in NGOs</b>
Beneficiary data supports every stage of an NGO's work: targeting, eligibility assessment, distribution, follow-up, donor reporting, and accountability. In many small and medium NGOs, particularly in developing countries, this data is held in paper registers, spreadsheets, or simple stand-alone software that was designed around one organization's workflow. Such data tends to be inconsistent in format, incomplete in identifiers, and difficult to search. Common problems include spelling variation in names, free-text addresses without a standard structure, missing or mistyped national identity numbers, and the absence of any shared definition of what a beneficiary record should contain. Research on data quality and record linkage consistently identifies these issues as the main obstacles to combining or comparing records across sources [4][5].
The implication for AidSync is that cross-organization verification cannot be built on raw data alone. A usable system must first impose structure: validated input fields, a consistent identifier policy, and normalization of free-text fields. It must then treat the remaining uncertainty as an expected feature of the data rather than as an exception.
<b>Duplication of Assistance and Inter-Agency Coordination</b>
When several agencies work in the same area without a shared view of who has been served, some households receive aid from more than one source while others receive none. This inefficiency is widely recognized in humanitarian and development practice. Large international agencies address it through registration platforms, common beneficiary registries, and formal data-sharing agreements, often with biometric identification. Governments run social-protection registries to target and de-duplicate public transfer programs; in Pakistan, for example, the CNIC issued by NADRA serves as the near-universal adult identifier and the National Socio-Economic Registry supports federal program targeting.
These solutions, however, assume institutional scale: dedicated registration infrastructure, legal data-sharing frameworks, technical staff, and sustained funding. Local NGOs, which deliver much community-level assistance, usually lack access to them and cannot afford bespoke integration. The practical result is a coordination gap at exactly the level where many duplicate-assistance cases occur. A lightweight, affordable, and trusted verification service that independent NGOs can join, without surrendering control over their own data or their final decisions, is therefore the missing piece that AidSync targets.
<b>Existing Systems and Their Limitations</b>
• The following comparison evaluates categories of existing solutions against AidSync. The comparison is made at the level of general design focus based on their publicly described purposes; it is not a feature audit of any specific product version.
• General NGO CRM tools (e.g., CiviCRM, Salesforce Nonprofit Cloud) are primarily focused on donor, volunteer, and constituent management. Shared cross-NGO verification is not a built-in goal because each organization runs its own instance. They offer basic duplicate checking inside one organization only, which means there is no shared multi-NGO beneficiary verification.
• Case-management software (e.g., Apricot-style tools) focuses on client case tracking and outcomes for one agency. It does not provide shared cross-NGO verification, and its duplicate matching is limited and works only within one agency. Its limitation relative to AidSync is its single-organization scope.
• Humanitarian reporting tools (e.g., ActivityInfo) focus on activity and indicator reporting across partners. They provide aggregated reporting, not person-level verification, so their matching is not person-level. They cannot answer whether a given person was already assisted.
• Large-agency registration platforms (e.g., WFP SCOPE, UNHCR registration systems) focus on registration and distribution for large agencies, often with biometrics. They provide shared verification within the agency and its partners, and their matching is strong, often biometric. However, they are heavy and costly for small NGOs and are not open to independent organizations.
• Government registries (e.g., NSER) focus on poverty targeting for public programs. Their shared verification is available for government programs only, and their matching is household-level. They are not available for NGO verification.
• Paper records and spreadsheets focus on local record keeping. They provide no shared cross-NGO verification and no duplicate or household matching. They are manual, error-prone, and unsearchable across NGOs.
• AidSync (proposed) focuses on shared verification for participating NGOs. It provides shared cross-NGO verification through a centralized, access-controlled database, and its duplicate and household matching is rule-based plus fuzzy and household-level matching with alerts. It is designed to fill the gap.

In conclusion, general-purpose NGO software optimizes for one organization's operations, cross-agency tools either aggregate statistics or require heavy institutional infrastructure, and none of the categories treats a match as advisory evidence with an explanation. AidSync is positioned in the space these systems leave open.
<b>Record Linkage and Duplicate Detection</b>
Deciding whether two records describe the same real-world entity is known variously as record linkage, entity resolution, data matching, or duplicate detection. The field began with the automated linkage of vital records [1] and was placed on a formal statistical footing by Fellegi and Sunter [2]. Their model compares the fields of a record pair, weights each agreement or disagreement by how discriminating it is, and assigns the pair to one of three outcomes: link, non-link, or possible link requiring clerical review. This three-way outcome is conceptually close to AidSync's design, in which a strong result and a possible result are both presented for human judgment rather than resolved automatically.

Subsequent work, summarized in the survey by Elmagarmid, Ipeirotis, and Verykios [3] and the monograph by Christen [4], describes a standard pipeline: data cleaning and standardization, blocking to limit comparisons, field comparison with similarity functions, pair classification, and evaluation. Classification approaches fall into three families:

• Deterministic (rule-based) methods declare a match when chosen fields agree exactly. They are transparent and fast but brittle when data contains errors.
• Probabilistic methods follow Fellegi and Sunter, combining field-level agreement weights into a score. They tolerate noise and give graded confidence [2][5].
• Learning-based methods train classifiers or adaptive similarity measures on labelled pairs [6][7]. They can achieve high accuracy but require labelled training data, which is not yet available for a new NGO setting.

Köpcke and Rahm's comparison of entity-matching frameworks [6] indicates that combining several attributes and matchers generally outperforms reliance on a single signal. For AidSync, a hybrid design is therefore appropriate: deterministic rules for strong identifiers (CNIC, phone), weighted fuzzy scoring for noisy attributes (name, address, family), and thresholds that map the score to explainable categories. A learning component is a plausible future extension once real labelled outcomes accumulate.
<b>Similarity Measures for Names and Addresses</b>
Approximate matching relies on string similarity functions. Edit distance, introduced by Levenshtein [8], counts the minimum insertions, deletions, and substitutions needed to turn one string into another and handles typing errors well. The Jaro and Jaro-Winkler measures [9] were developed for short personal names and give extra credit to a shared prefix. Token-based measures compare words as sets or sorted sequences, which tolerates reordered words, a frequent pattern in addresses. Phonetic encodings such as Soundex and Metaphone map similar-sounding names to a common code. Cohen, Ravikumar, and Fienberg [10] compared a range of string distance metrics on name-matching tasks and found that hybrid measures and Jaro-Winkler-style measures performed strongly, while no single metric was best for every dataset. This supports using more than one measure and tuning on local data.

Local conditions make this especially relevant. Pakistani names are written in Urdu script and transliterated into English, so one person may appear as Muhammad, Mohammad, Mohd, or Muhammed, and compound names may be spaced differently. Addresses have no enforced format, with house numbers, blocks, sectors, and landmarks written in many ways. Phone numbers appear in local (03xx) and international (+92) forms. A practical matcher must therefore combine normalization (a configurable variant dictionary and abbreviation expansion) with several similarity measures, rather than rely on exact string equality.
<b>Blocking and Scalability</b>
Comparing every pair of records grows quadratically with database size. Blocking reduces this cost by comparing only records that share a cheap key, such as an identifier, a phonetic code, or a postal code. The sorted-neighbourhood method of Hernández and Stolfo [11] is an early and influential example, and the survey by Papadakis et al. [12] reviews modern blocking and filtering techniques and their trade-off between recall and efficiency. Christophides et al. [13] give an end-to-end overview of entity resolution at scale. The relevance to AidSync is direct: candidate retrieval is performed with indexed SQL conditions (hashed CNIC, hashed phone, postal code plus phonetic key, and address full-text search), after which Python fuzzy scoring is applied to a bounded candidate set. This keeps search latency low as the number of NGOs and records grows, and the risk that blocking misses a true match is reduced by using several independent blocking keys.
<b>Household-Level Matching</b>
Aid is frequently targeted at households, whose members share housing, food, and expenses. Detecting related household records requires combining weaker signals: a shared or similar address, the same postal code, a common phone number, overlapping family-member names, and related father or surnames. No single signal is conclusive, and common surnames and shared buildings produce false positives. The record-linkage literature therefore recommends multi-field scoring with explicit uncertainty, and presenting borderline cases for review rather than final decisions [3][4]. AidSync adopts this approach by computing a weighted household-likelihood score and listing the specific evidence behind it.
<b>Data Protection, Security, and Ethics</b>
Beneficiary data reveals poverty status, health circumstances, and family composition, and usually includes national identity numbers. Humanitarian guidance, notably the ICRC Handbook on Data Protection in Humanitarian Action [14], emphasizes legitimate purpose, data minimization, proportionality, security, and accountability. Equivalent principles appear in general data-protection frameworks, and Pakistan's data-protection legislation has been proposed and debated; the design therefore follows these principles voluntarily: collect only what is needed, limit exposure, and keep an audit trail.

From a security engineering perspective, the OWASP Top 10 and Application Security Verification Standard [15] identify broken access control, cryptographic failures, injection, and security misconfiguration as leading web risks. The corresponding controls in AidSync are server-side role-based authorization on every endpoint, bcrypt password hashing [16], short-lived JWT access tokens [17], parameterized queries, input validation, HTTPS, rate limiting, hashed and encrypted storage of identifiers, and audit logging.

There is also an ethical dimension. A wrongful accusation of fraud can seriously harm a family, and matching algorithms inevitably produce false positives, particularly with common names. AidSync therefore functions strictly as decision support: it reports scores and reasons, uses neutral wording such as potential match, masks other organizations' personal data, and leaves the final decision to the NGO after physical verification.
<b>Technology Review and Justification</b>
Backend: Python with FastAPI. FastAPI is a Python web framework built on the Starlette toolkit and Pydantic. It supports asynchronous request handling, validates requests and responses from Python type hints, provides dependency injection (convenient for authentication and role checks), and generates OpenAPI documentation automatically [19]. Python was chosen primarily because the matching engine benefits from its ecosystem: RapidFuzz provides fast Levenshtein, Jaro-Winkler, and token-based scorers [20], and phonetic libraries such as Jellyfish and record-linkage toolkits are available in the same language. The API and the matching logic can therefore be developed, tested, and deployed as one codebase without a separate service.

Data access: SQLAlchemy supplies an object-relational mapper and query builder with parameterized queries by default [21], with Alembic for schema migrations. MySQL is retained as the relational store because it is mature, widely supported, and suitable for the structured, transactional data in this system.

Frontend: React.js with HTML5, CSS3, JavaScript, and Tailwind CSS or Bootstrap. Its component model suits form-heavy dashboards, and a REST interface [18] cleanly separates the frontend from the backend.
Security and operations: bcrypt [16], JWT [17], SMTP for password recovery, pytest for automated tests, Uvicorn with Gunicorn as the ASGI server, Nginx for TLS, and Git and GitHub for version control. Requirements and design documents follow ISO/IEC/IEEE 29148 [22] and IEEE 1016 [23].
<b>Critical Analysis and Research Gap</b>
The review supports four conclusions. First, duplicated assistance is a real consequence of fragmented beneficiary records, and existing solutions address it only at institutional scale. Second, mature record-linkage techniques exist but are rarely packaged as an explainable tool usable by non-technical NGO staff. Third, techniques developed largely for Western names and addresses need adaptation (normalization, transliteration variants, flexible address matching) to perform well on Pakistani data. Fourth, a system that stores data about vulnerable people must treat privacy, access control, and non-accusatory presentation as design requirements rather than additions.

AidSync responds to these gaps by contributing: (1) a lightweight shared verification platform for independent NGOs; (2) a hybrid matching engine combining rules, fuzzy similarity, blocking, and household scoring with explainable output; (3) localized normalization for Pakistani names, addresses, and phone formats; (4) separate storage of assistance date and record creation date to support historical data; and (5) a security and privacy model based on role-based access, hashing, encryption, masking, and audit logging.
<b>Summary</b>
The literature confirms that fragmented beneficiary records are a genuine coordination problem for NGOs, as existing systems either operate within a single organization, require heavy institutional infrastructure, or aggregate data without person-level verification. It provides proven record-linkage techniques, including deterministic rules, probabilistic scoring, fuzzy similarity measures (Jaro-Winkler, Levenshtein, token-based, phonetic), and blocking strategies for scalable candidate retrieval. It highlights the need for localized normalization to handle Pakistani names, addresses, and phone formats. It also emphasizes that privacy, security, and non-accusatory presentation must be treated as core design requirements rather than additions. These findings justify AidSync's hybrid matching approach, its centralized shared verification model, and its ethical decision-support design.
<b>References</b>
1.  Newcombe, H. B., Kennedy, J. M., Axford, S. J., & James, A. P. (1959). Automatic linkage of vital records. Science, 130(3381), 954-959.
2.  Fellegi, I. P., & Sunter, A. B. (1969). A theory for record linkage. Journal of the American Statistical Association, 64(328), 1183-1210.
3.  Elmagarmid, A. K., Ipeirotis, P. G., & Verykios, V. S. (2007). Duplicate record detection: A survey. IEEE Transactions on Knowledge and Data Engineering, 19(1), 1-16.
4.  Christen, P. (2012). Data Matching: Concepts and Techniques for Record Linkage, Entity Resolution, and Duplicate Detection. Springer.
5.  Herzog, T. N., Scheuren, F. J., & Winkler, W. E. (2007). Data Quality and Record Linkage Techniques. Springer.
6.  Koepcke, H., & Rahm, E. (2010). Frameworks for entity matching: A comparison. Data & Knowledge Engineering, 69(2), 197-210.
7.  Bilenko, M., & Mooney, R. J. (2003). Adaptive duplicate detection using learnable string similarity measures. Proceedings of the ACM SIGKDD International Conference on Knowledge Discovery and Data Mining.
8.  Levenshtein, V. I. (1966). Binary codes capable of correcting deletions, insertions, and reversals. Soviet Physics Doklady, 10(8), 707-710.
9.  Winkler, W. E. (1990). String comparator metrics and enhanced decision rules in the Fellegi-Sunter model of record linkage. Proceedings of the Section on Survey Research Methods, American Statistical Association.
10.  Cohen, W. W., Ravikumar, P., & Fienberg, S. E. (2003). A comparison of string distance metrics for name-matching tasks. Proceedings of the IJCAI Workshop on Information Integration on the Web.
11.  Hernandez, M. A., & Stolfo, S. J. (1995). The merge/purge problem for large databases. Proceedings of the ACM SIGMOD International Conference on Management of Data.
12.  Papadakis, G., Skoutas, D., Thanos, E., & Palpanas, T. (2020). Blocking and filtering techniques for entity resolution: A survey. ACM Computing Surveys, 53(2).
13.  Christophides, V., Efthymiou, V., Palpanas, T., Papadakis, G., & Stefanidis, K. (2020). An overview of end-to-end entity resolution for big data. ACM Computing Surveys, 53(6).
14.  International Committee of the Red Cross (2020). Handbook on Data Protection in Humanitarian Action (2nd ed.).
15.  OWASP Foundation. OWASP Top 10 and OWASP Application Security Verification Standard (ASVS).
16.  Provos, N., & Mazieres, D. (1999). A future-adaptable password scheme. USENIX Annual Technical Conference.
17.  Jones, M., Bradley, J., & Sakimura, N. (2015). JSON Web Token (JWT). RFC 7519, IETF.
18.  Fielding, R. T. (2000). Architectural Styles and the Design of Network-based Software Architectures (Doctoral dissertation). University of California, Irvine.
19.  FastAPI documentation. https://fastapi.tiangolo.com
20.  RapidFuzz documentation. https://rapidfuzz.github.io/RapidFuzz
21.  SQLAlchemy documentation. https://docs.sqlalchemy.org
22.  ISO/IEC/IEEE 29148:2018. Systems and software engineering: Life cycle processes: Requirements engineering.
23.  IEEE Std 1016-2009. IEEE Standard for Information Technology: Systems Design: Software Design Descriptions.`,
    order: 2
  },
  {
    title: "Software Requirements Specification",
    content: "SRS will be coming soon",
    order: 3
  },
   {
    title: "Software Design Description",
    content: "SDD will be coming soon",
    order: 4
  },
    {
    title: "Implementation",
    content: "Implementation will be coming soon",
    order: 5
  },
    {
    title: "Testing and Results",
    content: "Testing and Result will be coming soon",
    order: 6
  },
  {
    title: "Conclusion and Future Work",
    content: "Conclusion and Future Work will be coming soon",
    order: 7
  }
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Section.deleteMany({}); // Purana data clear karega
  await Section.insertMany(DATA); // Naya data daalega
  console.log("✅ Data seeded successfully! Frontend pe check karein.");
  process.exit();
});