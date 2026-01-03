import * as XLSX from 'xlsx'
import * as fs from 'fs'
import * as path from 'path'

// Sample data for Germany Master programs
const germanyMasterData = [
  { university_name: 'Technical University of Munich', program_name: 'Computer Science', language: 'english' },
  { university_name: 'Technical University of Munich', program_name: 'Data Engineering and Analytics', language: 'english' },
  { university_name: 'Ludwig Maximilian University of Munich', program_name: 'Business Administration', language: 'english' },
  { university_name: 'Heidelberg University', program_name: 'Applied Computer Science', language: 'english' },
  { university_name: 'RWTH Aachen University', program_name: 'Mechanical Engineering', language: 'english' },
  { university_name: 'University of Mannheim', program_name: 'Data Science', language: 'english' },
  { university_name: 'Humboldt University of Berlin', program_name: 'International Relations', language: 'english' },
  { university_name: 'Free University of Berlin', program_name: 'Management', language: 'english' },
  { university_name: 'University of Bonn', program_name: 'Economics', language: 'english' },
  { university_name: 'Technical University of Berlin', program_name: 'Electrical Engineering', language: 'english' },
]

const germanyBachelorData = [
  { university_name: 'Technical University of Munich', program_name: 'Computer Science', language: 'english' },
  { university_name: 'Ludwig Maximilian University of Munich', program_name: 'Business Administration', language: 'english' },
  { university_name: 'Heidelberg University', program_name: 'Mathematics', language: 'english' },
  { university_name: 'RWTH Aachen University', program_name: 'Mechanical Engineering', language: 'english' },
  { university_name: 'University of Mannheim', program_name: 'Business Informatics', language: 'english' },
]

const italyMasterData = [
  { university_name: 'Politecnico di Milano', program_name: 'Computer Science and Engineering', language: 'english' },
  { university_name: 'Bocconi University', program_name: 'International Management', language: 'english' },
  { university_name: 'Sapienza University of Rome', program_name: 'Data Science', language: 'english' },
  { university_name: 'University of Bologna', program_name: 'Business Administration', language: 'english' },
  { university_name: 'Politecnico di Torino', program_name: 'Mechanical Engineering', language: 'english' },
  { university_name: 'University of Padua', program_name: 'Computer Engineering', language: 'english' },
  { university_name: 'University of Milan', program_name: 'Economics and Finance', language: 'english' },
  { university_name: 'University of Pisa', program_name: 'Artificial Intelligence', language: 'english' },
]

const italyBachelorData = [
  { university_name: 'Politecnico di Milano', program_name: 'Engineering', language: 'english' },
  { university_name: 'Bocconi University', program_name: 'Economics', language: 'english' },
  { university_name: 'Sapienza University of Rome', program_name: 'Computer Science', language: 'english' },
  { university_name: 'University of Bologna', program_name: 'Business Administration', language: 'english' },
]

const polandMasterData = [
  { university_name: 'University of Warsaw', program_name: 'Computer Science', language: 'english' },
  { university_name: 'Jagiellonian University', program_name: 'International Relations', language: 'english' },
  { university_name: 'Warsaw University of Technology', program_name: 'Data Science', language: 'english' },
  { university_name: 'AGH University of Science and Technology', program_name: 'Computer Science', language: 'english' },
  { university_name: 'Wroclaw University of Technology', program_name: 'Artificial Intelligence', language: 'english' },
  { university_name: 'Poznan University of Technology', program_name: 'Software Engineering', language: 'english' },
]

const polandBachelorData = [
  { university_name: 'University of Warsaw', program_name: 'Computer Science', language: 'english' },
  { university_name: 'Jagiellonian University', program_name: 'Business', language: 'english' },
  { university_name: 'Warsaw University of Technology', program_name: 'Engineering', language: 'english' },
  { university_name: 'AGH University of Science and Technology', program_name: 'Computer Science', language: 'english' },
]

function createExcelFile(data: any[], filepath: string) {
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Programs')
  
  const dir = path.dirname(filepath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  
  XLSX.writeFile(wb, filepath)
  console.log(`Created: ${filepath}`)
}

const dataDir = path.join(process.cwd(), 'data')

createExcelFile(germanyMasterData, path.join(dataDir, 'master', 'germany_master.xlsx'))
createExcelFile(germanyBachelorData, path.join(dataDir, 'bachelor', 'germany_bachelor.xlsx'))
createExcelFile(italyMasterData, path.join(dataDir, 'master', 'italy_master.xlsx'))
createExcelFile(italyBachelorData, path.join(dataDir, 'bachelor', 'italy_bachelor.xlsx'))
createExcelFile(polandMasterData, path.join(dataDir, 'master', 'poland_master.xlsx'))
createExcelFile(polandBachelorData, path.join(dataDir, 'bachelor', 'poland_bachelor.xlsx'))

console.log('✅ Sample datasets created successfully!')
