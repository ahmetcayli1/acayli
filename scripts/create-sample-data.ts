import * as XLSX from 'xlsx'
import * as fs from 'fs'
import * as path from 'path'

// Sample data for master programs
const germanyMaster = [
  { university_name: 'Technical University of Munich', program_name: 'Computer Science', language: 'EN', description: 'Leading research in AI and software engineering', keywords: 'AI, Machine Learning, Software', tuition_info: '€0 per semester (admin fee ~€150)', ranking_qs: 50 },
  { university_name: 'Technical University of Munich', program_name: 'Data Engineering and Analytics', language: 'EN', description: 'Focus on big data and analytics', keywords: 'Data Science, Big Data, Analytics', tuition_info: '€0 per semester', ranking_qs: 50 },
  { university_name: 'RWTH Aachen', program_name: 'Mechanical Engineering', language: 'EN', description: 'Top mechanical engineering program', keywords: 'Mechanical, Engineering, Automotive', tuition_info: '€0 per semester', ranking_qs: 87 },
  { university_name: 'RWTH Aachen', program_name: 'Computer Science', language: 'EN', description: 'Strong focus on systems and software', keywords: 'Systems, Networks, Software', tuition_info: '€0 per semester', ranking_qs: 87 },
  { university_name: 'Ludwig Maximilian University of Munich', program_name: 'Economics', language: 'EN', description: 'Renowned economics program', keywords: 'Economics, Finance, Policy', tuition_info: '€0 per semester', ranking_qs: 63 },
  { university_name: 'Heidelberg University', program_name: 'Physics', language: 'EN', description: 'Nobel laureate faculty', keywords: 'Physics, Quantum, Research', tuition_info: '€1500 per semester (non-EU)', ranking_qs: 65 },
  { university_name: 'Humboldt University Berlin', program_name: 'Philosophy', language: 'DE', description: 'Historic philosophy department', keywords: 'Philosophy, Ethics, Logic', tuition_info: '€0 per semester', ranking_qs: 120 },
  { university_name: 'Free University Berlin', program_name: 'Political Science', language: 'EN', description: 'International relations focus', keywords: 'Politics, International, Policy', tuition_info: '€0 per semester', ranking_qs: 118 },
  { university_name: 'University of Mannheim', program_name: 'Business Administration', language: 'EN', description: 'Top business school in Germany', keywords: 'Business, Management, MBA', tuition_info: '€1500 per semester', ranking_qs: 314 },
  { university_name: 'Karlsruhe Institute of Technology', program_name: 'Electrical Engineering', language: 'EN', description: 'Strong industry connections', keywords: 'Electrical, Electronics, Power', tuition_info: '€1500 per semester (non-EU)', ranking_qs: 131 },
]

const italyMaster = [
  { university_name: 'Politecnico di Milano', program_name: 'Computer Science and Engineering', language: 'EN', description: 'Italy\'s top technical university', keywords: 'Computer Science, Engineering, AI', tuition_info: '€3900/year', ranking_qs: 139 },
  { university_name: 'Politecnico di Milano', program_name: 'Architecture', language: 'EN', description: 'World-renowned architecture program', keywords: 'Architecture, Design, Urban', tuition_info: '€3900/year', ranking_qs: 139 },
  { university_name: 'University of Bologna', program_name: 'Data Science', language: 'EN', description: 'Oldest university in the world', keywords: 'Data Science, Statistics, ML', tuition_info: '€2800/year', ranking_qs: 167 },
  { university_name: 'Bocconi University', program_name: 'International Management', language: 'EN', description: 'Premier business school', keywords: 'Management, Business, Finance', tuition_info: '€14000/year', ranking_qs: 18 },
  { university_name: 'Sapienza University of Rome', program_name: 'Artificial Intelligence', language: 'EN', description: 'Strong AI research', keywords: 'AI, Robotics, NLP', tuition_info: '€2900/year', ranking_qs: 171 },
  { university_name: 'University of Padua', program_name: 'Physics', language: 'EN', description: 'Galileo\'s university', keywords: 'Physics, Research, Space', tuition_info: '€2600/year', ranking_qs: 234 },
  { university_name: 'University of Milan', program_name: 'Economics', language: 'EN', description: 'Major economics hub', keywords: 'Economics, Finance, Public Policy', tuition_info: '€3000/year', ranking_qs: 324 },
  { university_name: 'University of Pisa', program_name: 'Mathematics', language: 'IT', description: 'Excellent math department', keywords: 'Mathematics, Pure Math, Applied', tuition_info: '€2500/year', ranking_qs: 405 },
]

const polandMaster = [
  { university_name: 'University of Warsaw', program_name: 'Computer Science', language: 'EN', description: 'Top Polish university for CS', keywords: 'Computer Science, Algorithms, AI', tuition_info: '€2000/year', ranking_qs: 284 },
  { university_name: 'University of Warsaw', program_name: 'Economics', language: 'EN', description: 'Leading economics program', keywords: 'Economics, Finance, Development', tuition_info: '€2000/year', ranking_qs: 284 },
  { university_name: 'Jagiellonian University', program_name: 'International Relations', language: 'EN', description: 'Historic university in Krakow', keywords: 'Politics, Diplomacy, EU', tuition_info: '€2500/year', ranking_qs: 304 },
  { university_name: 'Warsaw University of Technology', program_name: 'Robotics', language: 'EN', description: 'Strong engineering focus', keywords: 'Robotics, Automation, Control', tuition_info: '€3000/year', ranking_qs: 521 },
  { university_name: 'AGH University of Science and Technology', program_name: 'Data Science', language: 'EN', description: 'Mining and metallurgy heritage', keywords: 'Data Science, Mining, Energy', tuition_info: '€2000/year', ranking_qs: 801 },
  { university_name: 'Poznan University of Technology', program_name: 'Electrical Engineering', language: 'EN', description: 'Growing tech hub', keywords: 'Electrical, Power, Systems', tuition_info: '€2200/year', ranking_qs: 1001 },
]

// Sample data for bachelor programs
const germanyBachelor = [
  { university_name: 'Technical University of Munich', program_name: 'Informatics', language: 'DE', description: 'Foundational CS program', keywords: 'Programming, Algorithms, Math', tuition_info: '€0 per semester', ranking_qs: 50 },
  { university_name: 'RWTH Aachen', program_name: 'Mechanical Engineering', language: 'DE', description: 'Top engineering bachelor', keywords: 'Mechanics, Design, CAD', tuition_info: '€0 per semester', ranking_qs: 87 },
  { university_name: 'Jacobs University Bremen', program_name: 'Computer Science', language: 'EN', description: 'English-taught private university', keywords: 'CS, Software, Systems', tuition_info: '€20000/year', ranking_qs: 801 },
  { university_name: 'Universität Hamburg', program_name: 'Economics', language: 'DE', description: 'Strong economics foundation', keywords: 'Economics, Business, Finance', tuition_info: '€0 per semester', ranking_qs: 223 },
  { university_name: 'University of Freiburg', program_name: 'Physics', language: 'DE', description: 'Research-oriented physics', keywords: 'Physics, Research, Lab', tuition_info: '€1500 per semester (non-EU)', ranking_qs: 172 },
]

const italyBachelor = [
  { university_name: 'Politecnico di Milano', program_name: 'Engineering of Computing Systems', language: 'EN', description: 'Top-ranked engineering program', keywords: 'Computing, Systems, Engineering', tuition_info: '€3900/year', ranking_qs: 139 },
  { university_name: 'University of Bologna', program_name: 'Business and Economics', language: 'EN', description: 'Historic business program', keywords: 'Business, Economics, Management', tuition_info: '€2800/year', ranking_qs: 167 },
  { university_name: 'Bocconi University', program_name: 'International Economics and Management', language: 'EN', description: 'Elite business education', keywords: 'Economics, Management, Finance', tuition_info: '€13000/year', ranking_qs: 18 },
  { university_name: 'Sapienza University of Rome', program_name: 'Computer and System Engineering', language: 'EN', description: 'Large comprehensive program', keywords: 'Computer, Systems, Engineering', tuition_info: '€2900/year', ranking_qs: 171 },
]

const polandBachelor = [
  { university_name: 'University of Warsaw', program_name: 'Informatics', language: 'EN', description: 'Strong CS fundamentals', keywords: 'Programming, Math, Algorithms', tuition_info: '€2000/year', ranking_qs: 284 },
  { university_name: 'Jagiellonian University', program_name: 'European Studies', language: 'EN', description: 'Focus on EU and politics', keywords: 'Europe, Politics, Law', tuition_info: '€2500/year', ranking_qs: 304 },
  { university_name: 'Warsaw University of Technology', program_name: 'Civil Engineering', language: 'EN', description: 'Strong engineering foundations', keywords: 'Civil, Construction, Design', tuition_info: '€3000/year', ranking_qs: 521 },
  { university_name: 'Kozminski University', program_name: 'Management', language: 'EN', description: 'Triple-accredited business school', keywords: 'Management, Business, Entrepreneurship', tuition_info: '€5000/year', ranking_qs: 0 },
]

function createExcelFile(data: Record<string, unknown>[], filePath: string) {
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Programs')
  
  // Ensure directory exists
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  
  XLSX.writeFile(wb, filePath)
  console.log(`Created: ${filePath}`)
}

// Create all sample files
const dataDir = path.join(process.cwd(), 'data')

// Master programs
createExcelFile(germanyMaster, path.join(dataDir, 'master', 'germany_master.xlsx'))
createExcelFile(italyMaster, path.join(dataDir, 'master', 'italy_master.xlsx'))
createExcelFile(polandMaster, path.join(dataDir, 'master', 'poland_master.xlsx'))

// Bachelor programs
createExcelFile(germanyBachelor, path.join(dataDir, 'bachelor', 'germany_bachelor.xlsx'))
createExcelFile(italyBachelor, path.join(dataDir, 'bachelor', 'italy_bachelor.xlsx'))
createExcelFile(polandBachelor, path.join(dataDir, 'bachelor', 'poland_bachelor.xlsx'))

console.log('\n✅ All sample data files created!')
