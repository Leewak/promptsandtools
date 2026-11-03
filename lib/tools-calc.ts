// Calculators and unit converters. Kept in their own file so the registry in tools.ts only needs a one-line spread.
import type { ToolDef } from "./tools";
import { UNIT_SETS, convertUnit } from "../components/tools/calc/math";

export type CalcKind =
  | "percent" | "average" | "random" | "dice" | "fraction" | "calculator" | "roman" | "num-words"
  | "loan" | "mortgage" | "compound" | "simple-interest" | "savings-goal" | "tip" | "discount" | "vat" | "margin" | "fuel" | "electricity"
  | "age" | "date-diff" | "date-add" | "timezone" | "countdown" | "hours-decimal" | "work-hours"
  | "bmi" | "bmr" | "gpa" | "grade" | "unit";

const T = (n: string) => `${n} | Prompts&Tools`;
const PRIV = { q: "Is my data sent anywhere?", a: "No. The calculation runs in your browser with JavaScript. Nothing you enter is uploaded or stored, and closing the tab clears it." };
const FIN = { q: "Is this financial advice?", a: "No. It is a general-purpose calculator based on the formula shown on the page. Real products can include fees, taxes or different rounding, so confirm figures with your lender, bank or advisor." };
const MED = { q: "Is this medical advice?", a: "No. The result is general information from a standard formula. It cannot account for your health history, so talk to a doctor or dietitian before making health decisions." };

interface Spec {
  slug: string; kind: CalcKind; card?: boolean; name: string; short: string; category: "Calculators" | "Converters"; formats: string[]; keywords: string;
  title: string; description: string; h1: string; intro: string; howToTitle: string; steps: string[];
  faq: ToolDef["faq"]; related: string[]; crumb?: string; props?: Record<string, string | number>;
}
const m = (s: Spec): ToolDef => ({ ...s, card: !!s.card, title: T(s.title), crumb: s.crumb ?? s.name });

const calcs: ToolDef[] = [
  m({
    slug: "percentage-calculator", kind: "percent", card: true, name: "Percentage calculator", short: "X% of Y, what percent is X of Y, percent change and increase/decrease.", category: "Calculators",
    formats: ["% of", "% change"], keywords: "percentage calculator percent of change increase decrease",
    title: "Percentage Calculator: 4 Easy Ways, Free", description: "Work out X% of a number, what percent one number is of another, percentage change, and increase or decrease by a percent. Free and instant.",
    h1: "Percentage calculator", intro: "Four common percentage questions in one place. Fill in the box that matches your question and the answer appears right away.",
    howToTitle: "How to calculate a percentage", steps: ["Pick the question that matches yours, such as \"What is X% of Y?\".", "Type the two numbers. The result updates as you type.", "Use the formula under the calculator if you want to check the working by hand."],
    faq: [{ q: "How do I find 20% of 150?", a: "Divide 20 by 100 to get 0.2, then multiply by 150. The answer is 30." }, { q: "How is percentage change calculated?", a: "Subtract the old value from the new value, divide by the old value, then multiply by 100. A positive result is an increase and a negative one is a decrease." }, { q: "Why is a 50% rise followed by a 50% fall not back to the start?", a: "The second percentage applies to a bigger number. 100 up 50% is 150, and 150 down 50% is 75." }, PRIV],
    related: ["discount-calculator", "profit-margin-calculator", "average-calculator", "vat-calculator"],
  }),
  m({
    slug: "age-calculator", kind: "age", card: true, name: "Age calculator", short: "Exact age in years, months and days, plus days until your next birthday.", category: "Calculators",
    formats: ["Y/M/D", "Birthday"], keywords: "age calculator date of birth how old am i",
    title: "Age Calculator: Exact Years, Months, Days", description: "Enter a date of birth to get your exact age in years, months and days, total days lived and the countdown to your next birthday.",
    h1: "Age calculator", intro: "Find out exactly how old someone is today, or on any date you choose.",
    howToTitle: "How to calculate age", steps: ["Enter the date of birth.", "Leave \"Age at date\" as today, or pick another date.", "Read the age in years, months and days, plus total days and the next birthday."],
    faq: [{ q: "How is the age worked out?", a: "Whole years and months are counted on the calendar from the birth date, then the leftover days. This is the usual way ages are stated." }, { q: "How are leap-day birthdays handled?", a: "For someone born on 29 February, the next birthday in a non-leap year is shown as 28 February." }, { q: "Can I find age on a past or future date?", a: "Yes. Change the \"Age at date\" field to any date after the birth date." }, PRIV],
    related: ["date-difference-calculator", "add-days-to-date", "countdown-timer", "bmi-calculator"],
  }),
  m({
    slug: "date-difference-calculator", kind: "date-diff", name: "Days between dates", short: "Count the days, weeks and weekdays between two dates.", category: "Calculators",
    formats: ["Days", "Weekdays"], keywords: "days between dates date difference calculator how many days weeks business days",
    title: "Days Between Dates Calculator (Free & Exact)", description: "Count the days, weeks, months and weekdays between two dates. Optionally include the end date. Free, instant and private.",
    h1: "Days between two dates", intro: "Pick a start and an end date to see how many days, weeks and working days lie between them.",
    howToTitle: "How to count days between dates", steps: ["Choose the start date and the end date.", "Tick \"Include the end date\" if both days should count.", "Read days, weeks, years/months/days and weekdays."],
    faq: [{ q: "Does it include the start and end day?", a: "By default it counts the nights between, so 1 Jan to 2 Jan is 1 day. Tick the box to count both dates, which makes it 2." }, { q: "Does weekdays count public holidays?", a: "No. It counts Monday to Friday only, because holidays differ by country and year." }, { q: "Does the order of dates matter?", a: "No. If the end is before the start, the dates are swapped for you." }, PRIV],
    related: ["add-days-to-date", "age-calculator", "countdown-timer", "work-hours-calculator"], crumb: "Days between dates",
  }),
  m({
    slug: "add-days-to-date", kind: "date-add", name: "Add days to a date", short: "Add or subtract days, weeks, months or years from any date.", category: "Calculators",
    formats: ["+ Days", "+ Months"], keywords: "add days to date date calculator what is the date in 30 days subtract",
    title: "Add or Subtract Days From a Date Calculator", description: "Find the date that is 30, 60 or 90 days from now, or any number of days, weeks, months or years before or after a date.",
    h1: "Add days to a date", intro: "Need a deadline, due date or warranty end? Add or subtract time from a date and get the weekday too.",
    howToTitle: "How to add days to a date", steps: ["Choose Add or Subtract.", "Set the start date and the amount, then pick days, weeks, months or years.", "Read the resulting date with its weekday."],
    faq: [{ q: "What is the date 90 days from today?", a: "Set the amount to 90 and the unit to days; the calculator uses today's date as the default start." }, { q: "What happens when I add a month to the 31st?", a: "If the target month is shorter, the last day of that month is used. 31 January plus 1 month is 28 or 29 February." }, { q: "Are weekends counted?", a: "Yes, every calendar day counts. It does not skip weekends or holidays." }, PRIV],
    related: ["date-difference-calculator", "age-calculator", "countdown-timer", "time-zone-converter"],
  }),
  m({
    slug: "time-zone-converter", kind: "timezone", card: true, name: "Time zone converter", short: "Convert a date and time between any two time zones, with daylight saving.", category: "Converters",
    formats: ["UTC", "DST"], keywords: "time zone converter world clock meeting planner utc est pst gmt",
    title: "Time Zone Converter: Any City, With DST", description: "Convert a date and time between any two time zones using your browser's up-to-date time zone data, including daylight saving time.",
    h1: "Time zone converter", intro: "Plan a call or a flight across time zones. Pick a time, a source zone and a target zone.",
    howToTitle: "How to convert time zones", steps: ["Enter the date and time in the source zone.", "Choose the \"From\" and \"To\" time zones.", "Read the converted time and the table of other major zones."],
    faq: [{ q: "Does it handle daylight saving time?", a: "Yes. Offsets come from your browser's time zone database for the exact date you enter, so summer and winter times are right." }, { q: "Which zone does it start with?", a: "Your device's own time zone, read from the browser. Nothing is sent to a server." }, { q: "What if the time doesn't exist or happens twice?", a: "On the night clocks change, one hour is skipped or repeated. The tool picks a valid time near it; double-check important meetings." }, { q: "Where is the list of zones from?", a: "From the IANA time zone database built into your browser, so city names follow the standard Region/City format." }],
    related: ["unix-timestamp-converter", "countdown-timer", "add-days-to-date", "date-difference-calculator"],
  }),
  m({
    slug: "countdown-timer", kind: "countdown", name: "Countdown to a date", short: "Live countdown in days, hours, minutes and seconds to any date.", category: "Calculators",
    formats: ["Live", "Days"], keywords: "countdown timer days until date how many days until",
    title: "Countdown to a Date: Days Until, Live Timer", description: "Pick any date and time and see a live countdown in days, hours, minutes and seconds. Also works to show the time since a past date.",
    h1: "Countdown to a date", intro: "How long until your holiday, exam or launch? Choose the moment and watch the clock.",
    howToTitle: "How to count down to a date", steps: ["Pick the target date and time.", "Read the live countdown, which updates every second.", "Leave the page open or note the total days for a plan."],
    faq: [{ q: "Which time zone does it use?", a: "Your device's local time zone. The target is read as local time." }, { q: "Can I count up from a past date?", a: "Yes. If the date is in the past, the tool shows the time since then instead." }, { q: "Does it keep running in the background?", a: "It updates only while the page is open. Your device clock is the reference." }, PRIV],
    related: ["date-difference-calculator", "add-days-to-date", "age-calculator", "time-zone-converter"], crumb: "Countdown",
  }),
  m({
    slug: "loan-calculator", kind: "loan", card: true, name: "Loan calculator", short: "Monthly payment, total interest and a yearly schedule for any loan.", category: "Calculators",
    formats: ["EMI", "Schedule"], keywords: "loan calculator emi monthly payment interest personal loan car loan amortization",
    title: "Loan Calculator: Monthly Payment & Interest", description: "Calculate the monthly payment, total interest and a yearly repayment schedule for a car, personal or student loan. Free, no sign-up.",
    h1: "Loan calculator (EMI)", intro: "Enter the amount, rate and term to see what you would pay each month and in total.",
    howToTitle: "How to calculate a loan payment", steps: ["Type the loan amount and the yearly interest rate.", "Enter the term in years or months.", "Read the monthly payment, total interest and the year-by-year table."],
    faq: [{ q: "What formula does it use?", a: "The standard amortization formula: payment = P × r ÷ (1 − (1 + r)^−n), with r the monthly rate and n the number of months." }, { q: "Does the rate mean APR?", a: "Enter the nominal yearly rate. Fees and insurance that raise the APR are not included, so your lender's quote may differ." }, { q: "Can I enter 0% interest?", a: "Yes. The payment is then simply the amount divided by the number of months." }, FIN],
    related: ["mortgage-calculator", "compound-interest-calculator", "simple-interest-calculator", "savings-goal-calculator"],
  }),
  m({
    slug: "mortgage-calculator", kind: "mortgage", name: "Mortgage calculator", short: "Monthly home payment with property tax and insurance included.", category: "Calculators",
    formats: ["P&I", "Tax"], keywords: "mortgage calculator monthly payment home loan down payment property tax",
    title: "Mortgage Calculator With Tax & Insurance", description: "Estimate your monthly mortgage payment from price, down payment, rate and term, with property tax and home insurance added in.",
    h1: "Mortgage calculator", intro: "See the monthly cost of a home loan, split into principal and interest, tax and insurance.",
    howToTitle: "How to estimate a mortgage payment", steps: ["Enter the home price and your down payment.", "Add the interest rate and loan term in years.", "Optionally enter the yearly property tax rate and insurance cost, then read the total monthly payment."],
    faq: [{ q: "What is included in the payment?", a: "Principal and interest on a fixed-rate loan, plus the property tax and insurance you enter. PMI, HOA fees and closing costs are not included." }, { q: "What interest rate should I use?", a: "Use the rate in your lender's quote. This tool never assumes a rate for you." }, { q: "How much down payment do I need?", a: "It depends on the lender and loan type. The tool shows your down payment as a percentage of the price to compare." }, FIN],
    related: ["loan-calculator", "compound-interest-calculator", "savings-goal-calculator", "percentage-calculator"],
  }),
  m({
    slug: "compound-interest-calculator", kind: "compound", card: true, name: "Compound interest calculator", short: "See how savings grow with compounding and monthly deposits.", category: "Calculators",
    formats: ["Growth", "Monthly add"], keywords: "compound interest calculator investment growth savings monthly contribution",
    title: "Compound Interest Calculator With Deposits", description: "See how an amount grows with compound interest, with yearly, monthly or daily compounding and optional monthly deposits. Free and instant.",
    h1: "Compound interest calculator", intro: "Watch interest earn interest. Add a starting amount, a rate and a time, with optional monthly deposits.",
    howToTitle: "How to calculate compound interest", steps: ["Enter your starting amount, yearly rate and number of years.", "Choose how often interest compounds and any monthly deposit.", "Read the future value, total contributed and interest earned."],
    faq: [{ q: "What is the formula?", a: "A = P × (1 + r/n)^(n×t). For example 10,000 at 5% compounded yearly for 10 years grows to 16,288.95." }, { q: "How are monthly deposits treated?", a: "Each deposit is added at the end of the month and earns interest at the monthly rate equivalent to your compounding choice." }, { q: "Does this include tax, fees or inflation?", a: "No. Returns are not guaranteed, and real investments carry risk, taxes and fees. Use it for illustration only." }, FIN],
    related: ["simple-interest-calculator", "savings-goal-calculator", "loan-calculator", "percentage-calculator"],
  }),
  m({
    slug: "simple-interest-calculator", kind: "simple-interest", name: "Simple interest calculator", short: "Interest = principal × rate × time, in years, months or days.", category: "Calculators",
    formats: ["I = PRT"], keywords: "simple interest calculator formula principal rate time",
    title: "Simple Interest Calculator (I = P × R × T)", description: "Calculate simple interest and the total amount from principal, yearly rate and time in years, months or days. Shows the formula.",
    h1: "Simple interest calculator", intro: "For loans and deposits that do not compound, interest is just principal times rate times time.",
    howToTitle: "How to calculate simple interest", steps: ["Enter the principal and the yearly interest rate.", "Enter the time and pick years, months or days.", "Read the interest and the total amount."],
    faq: [{ q: "What is the simple interest formula?", a: "Interest = P × R × T, where R is the yearly rate as a decimal and T is in years. 1,000 at 5% for 3 years earns 150." }, { q: "How is it different from compound interest?", a: "Simple interest is always calculated on the original principal. Compound interest is calculated on the principal plus earlier interest." }, { q: "How are days converted?", a: "Days are divided by 365 to get years, and months are divided by 12." }, FIN],
    related: ["compound-interest-calculator", "loan-calculator", "percentage-calculator", "savings-goal-calculator"],
  }),
  m({
    slug: "savings-goal-calculator", kind: "savings-goal", name: "Savings goal calculator", short: "How much to save each month to reach a target by a date.", category: "Calculators",
    formats: ["Monthly", "Goal"], keywords: "savings goal calculator how much to save per month target",
    title: "Savings Goal Calculator: Monthly Amount Needed", description: "Work out how much to save each month to reach a savings target in a set number of months, with optional interest.",
    h1: "Savings goal calculator", intro: "Set a target and a deadline. The calculator tells you the monthly deposit needed.",
    howToTitle: "How to plan a savings goal", steps: ["Enter your goal and what you have already saved.", "Add a yearly interest rate, or 0 if none.", "Enter the months you have and read the monthly amount."],
    faq: [{ q: "What if I earn no interest?", a: "Enter 0. The monthly amount is then (goal − already saved) ÷ months." }, { q: "When are deposits made?", a: "At the end of each month, with interest compounded monthly." }, { q: "Are savings rates guaranteed?", a: "No. Rates change and may be taxed, so treat the interest figure as an estimate." }, FIN],
    related: ["compound-interest-calculator", "loan-calculator", "simple-interest-calculator", "add-days-to-date"],
  }),
  m({
    slug: "tip-calculator", kind: "tip", card: true, name: "Tip calculator", short: "Work out the tip and split the bill between friends.", category: "Calculators",
    formats: ["Tip %", "Split"], keywords: "tip calculator split bill gratuity restaurant",
    title: "Tip Calculator: Split the Bill Easily", description: "Calculate the tip and total for a restaurant bill and split it between any number of people. Quick 10%, 15%, 18%, 20% and 25% buttons.",
    h1: "Tip calculator", intro: "Enter the bill, choose a tip percentage and the number of people.",
    howToTitle: "How to calculate a tip", steps: ["Type the bill amount.", "Choose a tip percentage with the quick buttons or type your own.", "Set how many people share the bill and read the amount per person."],
    faq: [{ q: "How much should I tip?", a: "It depends on the country. In the US 15–20% is common in restaurants; in many other countries service is included or tipping is smaller. Check local custom." }, { q: "Should I tip on the pre-tax amount?", a: "Many people tip on the pre-tax subtotal, others on the full bill. Enter whichever amount you prefer." }, { q: "Does it round per person?", a: "Amounts are shown to two decimals. Totals may differ by a cent when split." }, PRIV],
    related: ["percentage-calculator", "discount-calculator", "vat-calculator", "basic-calculator"],
  }),
  m({
    slug: "discount-calculator", kind: "discount", card: true, name: "Discount calculator", short: "Sale price and savings after a percent discount, even two stacked.", category: "Calculators",
    formats: ["% off", "Stacked"], keywords: "discount calculator sale price percent off savings",
    title: "Discount Calculator: Sale Price & You Save", description: "Find the sale price and how much you save after a percentage discount, including a second extra discount stacked on top.",
    h1: "Discount calculator", intro: "See the final price at a glance when something is 20%, 30% or 50% off.",
    howToTitle: "How to calculate a discount", steps: ["Enter the original price.", "Type the discount percentage, and a second one if the shop stacks offers.", "Read the sale price and your savings."],
    faq: [{ q: "How do I work out 25% off?", a: "Multiply the price by 0.75. A 120 item at 25% off costs 90." }, { q: "Do two discounts add up?", a: "Not by simple addition. They apply one after the other, so 20% then 10% off is 28% off in total." }, { q: "Does it include tax?", a: "No. Add tax afterwards with the VAT / sales tax calculator." }, PRIV],
    related: ["percentage-calculator", "vat-calculator", "profit-margin-calculator", "tip-calculator"],
  }),
  m({
    slug: "vat-calculator", kind: "vat", name: "VAT / sales tax calculator", short: "Add tax to a price or remove it, using the rate you enter.", category: "Calculators",
    formats: ["Add", "Remove"], keywords: "vat calculator sales tax gst add remove tax inclusive exclusive",
    title: "VAT & Sales Tax Calculator: Add or Remove", description: "Add VAT or sales tax to a net price, or remove it from a gross price, using your own rate. Shows net, tax and gross amounts.",
    h1: "VAT / sales tax calculator", intro: "Switch between adding tax to a price and extracting it from a price that already includes it.",
    howToTitle: "How to add or remove VAT", steps: ["Choose Add tax or Remove tax.", "Enter the amount and your local tax rate.", "Read the net, tax and gross amounts."],
    faq: [{ q: "Which tax rate should I enter?", a: "The rate that applies where you are and to that product. The tool does not assume any rate." }, { q: "How do I take VAT out of a price?", a: "Divide the gross price by 1 + rate. With 20% VAT, 120 ÷ 1.2 = 100, so the tax is 20." }, { q: "Why is removing 20% not the same as subtracting 20%?", a: "Because the tax was added on the net price, not on the gross. Taking 20% off 120 gives 96, not 100." }, { q: "Is this tax advice?", a: "No. It is a calculator; confirm rules for invoices and exemptions with your tax authority or accountant." }],
    related: ["discount-calculator", "profit-margin-calculator", "percentage-calculator", "tip-calculator"],
  }),
  m({
    slug: "profit-margin-calculator", kind: "margin", name: "Profit margin & markup calculator", short: "Margin and markup from cost and price, or price from a target margin.", category: "Calculators",
    formats: ["Margin", "Markup"], keywords: "profit margin calculator markup selling price cost gross margin",
    title: "Profit Margin & Markup Calculator", description: "Calculate profit margin and markup from cost and selling price, or find the price you need to hit a target margin or markup.",
    h1: "Profit margin & markup calculator", intro: "Margin and markup are often confused. This tool shows both and lets you price backwards from a target.",
    howToTitle: "How to calculate profit margin", steps: ["Pick a mode: from cost and price, or price from a target.", "Enter the cost and either the selling price or the target percentage.", "Read the margin, markup, profit and price."],
    faq: [{ q: "What is the difference between margin and markup?", a: "Margin is profit as a share of the selling price. Markup is profit as a share of the cost. Cost 60, price 100 is a 40% margin and a 66.7% markup." }, { q: "How do I get a 30% margin?", a: "Divide your cost by 0.70. A cost of 70 gives a selling price of 100." }, { q: "Is this gross or net margin?", a: "It uses only the cost you type, so it is a gross margin. Add overheads into the cost for a fuller picture." }, PRIV],
    related: ["percentage-calculator", "discount-calculator", "vat-calculator", "basic-calculator"], crumb: "Profit margin",
  }),
  m({
    slug: "bmi-calculator", kind: "bmi", card: true, name: "BMI calculator", short: "Body mass index with WHO adult categories, in metric or imperial.", category: "Calculators",
    formats: ["kg/m²", "WHO"], keywords: "bmi calculator body mass index healthy weight adult",
    title: "BMI Calculator for Adults (kg/cm or lb/ft)", description: "Calculate your body mass index with standard WHO adult categories and a healthy weight range for your height. General information, not medical advice.",
    h1: "BMI calculator", intro: "Enter your weight and height in metric or imperial units to get your BMI and where it falls on the WHO adult scale.",
    howToTitle: "How to calculate BMI", steps: ["Choose Metric or Imperial.", "Enter your weight and height.", "Read your BMI, the WHO category and the weight range for your height."],
    faq: [{ q: "How is BMI calculated?", a: "Weight in kilograms divided by height in metres squared. 70 kg at 1.75 m gives 22.9." }, { q: "What are the WHO categories?", a: "Under 18.5 underweight, 18.5 to 24.9 normal weight, 25 to 29.9 overweight and 30 or more obesity, for adults." }, { q: "Is BMI accurate for everyone?", a: "No. It does not measure body fat or muscle and can mislead for athletes, older adults, pregnancy and children. Use it as a rough screen only." }, MED],
    related: ["calorie-calculator", "kg-to-lbs", "cm-to-inches", "age-calculator"],
  }),
  m({
    slug: "calorie-calculator", kind: "bmr", name: "Calorie & BMR calculator", short: "Daily calories and BMR using the Mifflin-St Jeor equation.", category: "Calculators",
    formats: ["BMR", "TDEE"], keywords: "calorie calculator bmr tdee maintenance calories mifflin st jeor",
    title: "Calorie & BMR Calculator (Mifflin-St Jeor)", description: "Estimate your basal metabolic rate and daily maintenance calories with the Mifflin-St Jeor equation. General information, not medical advice.",
    h1: "Calorie & BMR calculator", intro: "Estimate how many calories your body burns at rest and with your activity level.",
    howToTitle: "How to estimate daily calories", steps: ["Choose male or female and enter your age, weight and height.", "Pick the activity level that fits a typical week.", "Read your BMR and estimated maintenance calories."],
    faq: [{ q: "What is BMR?", a: "Basal metabolic rate is the energy your body uses at complete rest. Mifflin-St Jeor estimates it from weight, height, age and sex." }, { q: "What is TDEE?", a: "Total daily energy expenditure is BMR multiplied by an activity factor, from 1.2 for little exercise to 1.9 for very hard exercise." }, { q: "How accurate is it?", a: "It is an estimate, typically within about 10%. Real needs vary with body composition, genetics and health." }, MED],
    related: ["bmi-calculator", "kg-to-lbs", "cm-to-inches", "age-calculator"], crumb: "Calorie calculator",
  }),
  m({
    slug: "gpa-calculator", kind: "gpa", card: true, name: "GPA calculator", short: "Add your courses, credits and grades to get your GPA on a 4.0 scale.", category: "Calculators",
    formats: ["4.0 scale"], keywords: "gpa calculator grade point average college high school credits",
    title: "GPA Calculator: Free 4.0 Scale Grade Average", description: "Add your courses, credits and letter grades to calculate your GPA on the standard unweighted 4.0 scale. Shows the points used.",
    h1: "GPA calculator", intro: "List each course with its credit hours and grade. Your GPA updates as you go.",
    howToTitle: "How to calculate your GPA", steps: ["Enter the credits for each course.", "Pick the letter grade you earned or expect.", "Add more rows if needed and read your GPA."],
    faq: [{ q: "How is GPA calculated?", a: "Multiply each course's credits by its grade points, add them up, and divide by the total credits." }, { q: "Which grade scale is used?", a: "The common US unweighted scale: A 4.0, A- 3.7, B+ 3.3, B 3.0 and so on down to F 0. Your school may differ." }, { q: "Does it support weighted GPA?", a: "No. Honors and AP weighting varies by school, so use your school's official numbers for that." }, PRIV],
    related: ["grade-calculator", "average-calculator", "percentage-calculator", "basic-calculator"],
  }),
  m({
    slug: "grade-calculator", kind: "grade", name: "Grade calculator", short: "Score to percentage and letter grade, or the final exam score you need.", category: "Calculators",
    formats: ["% to grade", "Final"], keywords: "grade calculator percentage to letter grade final exam score needed",
    title: "Grade Calculator: Letter Grade & Final Score", description: "Turn a test score into a percentage and letter grade, or find the score you need on your final exam to reach a target grade.",
    h1: "Grade calculator", intro: "Two quick tools: convert points to a percentage and letter, and see what you need on the final.",
    howToTitle: "How to calculate your grade", steps: ["Enter points earned and points possible for the percentage and letter.", "For the final, enter your current grade, how much the final counts, and your goal.", "Read the score you need."],
    faq: [{ q: "How do I find the score I need on a final?", a: "Needed = (goal − current × (1 − weight)) ÷ weight. With 82% now, a final worth 30% and a goal of 90%, you need about 108.7%, so 90% is out of reach." }, { q: "What letter bands are used?", a: "A 90+, B 80–89, C 70–79, D 60–69 and F below 60. Schools differ." }, { q: "Are extra-credit points allowed?", a: "Yes. Points earned may exceed points possible; the percentage can pass 100%." }, PRIV],
    related: ["gpa-calculator", "percentage-calculator", "average-calculator", "basic-calculator"],
  }),
  m({
    slug: "average-calculator", kind: "average", name: "Average, median & mode calculator", short: "Mean, median, mode, range and sum for any list of numbers.", category: "Calculators",
    formats: ["Mean", "Median", "Mode"], keywords: "average calculator mean median mode range statistics",
    title: "Mean, Median, Mode & Range Calculator", description: "Paste a list of numbers and get the mean (average), median, mode, range, sum, count, smallest and largest value instantly.",
    h1: "Average, median & mode calculator", intro: "Paste or type numbers separated by commas, spaces or new lines.",
    howToTitle: "How to find the average of numbers", steps: ["Enter your numbers in the box.", "The statistics update as you type.", "Copy the values you need."],
    faq: [{ q: "What is the difference between mean, median and mode?", a: "Mean is the sum divided by the count. Median is the middle value of the sorted list. Mode is the most frequent value." }, { q: "What if two values tie for mode?", a: "All tied values are listed. If every value appears once, there is no mode." }, { q: "How is median found with an even count?", a: "It is the average of the two middle values." }, PRIV],
    related: ["percentage-calculator", "gpa-calculator", "grade-calculator", "random-number-generator"], crumb: "Average calculator",
  }),
  m({
    slug: "random-number-generator", kind: "random", card: true, name: "Random number generator", short: "Random whole numbers or decimals in any range, with or without repeats.", category: "Calculators",
    formats: ["Range", "No repeats"], keywords: "random number generator between range lottery picker unique",
    title: "Random Number Generator: Pick Any Range", description: "Generate one or many random numbers between any minimum and maximum, with or without repeats, using your browser's secure random generator.",
    h1: "Random number generator", intro: "Set a range, say how many numbers you want and click Generate.",
    howToTitle: "How to generate a random number", steps: ["Enter the minimum and maximum.", "Choose how many numbers, and tick No repeats or Decimals if needed.", "Click Generate."],
    faq: [{ q: "Is it truly random?", a: "It uses the Web Crypto random generator built into your browser, with rejection sampling so no number is favoured." }, { q: "Are the minimum and maximum included?", a: "Yes, both ends are possible for whole numbers." }, { q: "Can I pick lottery numbers?", a: "You can generate unique numbers in a range, but it gives no better odds. Lottery results are random." }, PRIV],
    related: ["dice-roller", "average-calculator", "random-name-picker", "uuid-generator"],
  }),
  m({
    slug: "dice-roller", kind: "dice", name: "Dice roller", short: "Roll 1 to 20 dice with 4, 6, 8, 10, 12, 20 or 100 sides.", category: "Calculators",
    formats: ["d6", "d20"], keywords: "dice roller online roll d6 d20 dnd virtual dice",
    title: "Dice Roller: d4, d6, d20 and More, Online", description: "Roll up to 20 dice online: d4, d6, d8, d10, d12, d20 or d100. See each die and the total. Free and fair.",
    h1: "Dice roller", intro: "For board games, tabletop RPGs or a quick decision. Choose how many dice and how many sides.",
    howToTitle: "How to roll dice online", steps: ["Set the number of dice.", "Pick the sides per die, such as d6 or d20.", "Click Roll the dice and read each die and the total."],
    faq: [{ q: "Is the dice roll fair?", a: "Yes. Each die uses a secure random number with no bias toward any side." }, { q: "Can I roll d20 for D&D?", a: "Yes. Choose d20 and the number of dice you need; add modifiers yourself." }, { q: "How many dice can I roll?", a: "Up to 20 at once." }, PRIV],
    related: ["random-number-generator", "random-name-picker", "basic-calculator", "average-calculator"],
  }),
  m({
    slug: "fraction-calculator", kind: "fraction", name: "Fraction calculator", short: "Add, subtract, multiply or divide fractions and simplify the result.", category: "Calculators",
    formats: ["+ − × ÷"], keywords: "fraction calculator add subtract multiply divide simplify mixed number",
    title: "Fraction Calculator: Add, Subtract, Multiply", description: "Add, subtract, multiply or divide fractions and get the simplified answer, mixed number and decimal. Free and instant.",
    h1: "Fraction calculator", intro: "Type two fractions like 3/4 and 2/5 or whole numbers, pick an operation and read the simplified result.",
    howToTitle: "How to calculate with fractions", steps: ["Enter the first and second fraction in a/b form.", "Choose add, subtract, multiply or divide.", "Read the simplified fraction, mixed number and decimal."],
    faq: [{ q: "How do I add fractions with different denominators?", a: "Use cross-multiplication: a/b + c/d = (ad + cb) ÷ bd, then simplify. 1/2 + 1/3 = 5/6." }, { q: "How are results simplified?", a: "The numerator and denominator are divided by their greatest common divisor." }, { q: "Can I enter mixed numbers?", a: "Enter an improper fraction instead; 1 1/2 is 3/2." }, PRIV],
    related: ["percentage-calculator", "basic-calculator", "average-calculator", "number-to-words"],
  }),
  m({
    slug: "basic-calculator", kind: "calculator", name: "Online calculator", short: "A calculator with brackets, powers, percent, square root and trig.", category: "Calculators",
    formats: ["( )", "√", "^"], keywords: "online calculator scientific calculator brackets power square root",
    title: "Online Calculator: Basic & Scientific", description: "A free online calculator with brackets, powers, percent, square root, pi, logs and trig. Type an expression or use the keypad.",
    h1: "Online calculator", intro: "Type a full expression such as (12.5 + 7.5) × 3 ÷ 2 and see the answer immediately.",
    howToTitle: "How to use this calculator", steps: ["Type an expression or tap the keys.", "The result shows as you type.", "Use Clear to start again."],
    faq: [{ q: "Which functions are supported?", a: "+ − × ÷ ^ % brackets, pi, e, sqrt, sin, cos, tan (in degrees), ln, log and abs." }, { q: "What order are operations done in?", a: "Brackets, then powers, then multiplication and division, then addition and subtraction." }, { q: "Is it safe to use?", a: "Yes. Expressions are parsed by a small built-in evaluator in your browser, not run as code, and nothing is sent anywhere." }, { q: "Why does 0.1 + 0.2 show 0.3?", a: "Results are rounded to 12 significant digits to hide tiny binary floating-point errors." }],
    related: ["percentage-calculator", "fraction-calculator", "average-calculator", "number-to-words"], crumb: "Calculator",
  }),
  m({
    slug: "hours-to-decimal-calculator", kind: "hours-decimal", name: "Hours & minutes to decimal", short: "Convert 7:45 to 7.75 hours and back, for timesheets and payroll.", category: "Converters",
    formats: ["h:mm", "Decimal"], keywords: "hours to decimal calculator minutes to decimal time card timesheet",
    title: "Hours & Minutes to Decimal Hours Calculator", description: "Convert hours and minutes to decimal hours (7h 45m = 7.75) and decimal hours back to hours and minutes. Handy for timesheets.",
    h1: "Hours and minutes to decimal", intro: "Payroll systems often want 7.75 instead of 7:45. Convert either way.",
    howToTitle: "How to convert time to decimal hours", steps: ["Enter hours and minutes to get the decimal.", "Or enter decimal hours to get hours and minutes.", "Copy the value into your timesheet."],
    faq: [{ q: "How do I convert minutes to a decimal?", a: "Divide the minutes by 60. 45 minutes is 0.75 hours and 20 minutes is 0.333 hours." }, { q: "What is 0.5 hours in minutes?", a: "30 minutes. Multiply the decimal part by 60." }, { q: "Why do payroll systems use decimals?", a: "Multiplying decimal hours by an hourly rate is simpler than working with minutes." }, PRIV],
    related: ["work-hours-calculator", "date-difference-calculator", "time-zone-converter", "percentage-calculator"],
  }),
  m({
    slug: "work-hours-calculator", kind: "work-hours", name: "Work hours calculator", short: "Weekly time card: start, end and breaks to total hours and pay.", category: "Calculators",
    formats: ["Weekly", "Pay"], keywords: "work hours calculator timesheet time card hours worked weekly",
    title: "Work Hours Calculator: Weekly Time Card", description: "Enter start time, end time and break for each day to total your weekly hours worked in hours and decimals, with optional gross pay.",
    h1: "Work hours calculator", intro: "Fill in your shifts for the week and get total hours worked, ready for a timesheet.",
    howToTitle: "How to calculate hours worked", steps: ["Enter start and end times for each day you worked.", "Add unpaid break minutes.", "Read the total, and add an hourly rate for gross pay."],
    faq: [{ q: "How are overnight shifts handled?", a: "If the end time is earlier than the start time, the tool assumes the shift ended the next day and adds 24 hours." }, { q: "Does it calculate overtime?", a: "No. Overtime rules vary by country and contract, so only total hours and simple gross pay are shown." }, { q: "What are decimal hours?", a: "Hours with minutes as a fraction; 8h 30m is 8.5. Many payroll systems use them." }, PRIV],
    related: ["hours-to-decimal-calculator", "date-difference-calculator", "percentage-calculator", "tip-calculator"],
  }),
  m({
    slug: "fuel-cost-calculator", kind: "fuel", name: "Trip fuel cost calculator", short: "Fuel needed and cost for a trip, in km and L/100 km or miles and mpg.", category: "Calculators",
    formats: ["L/100km", "mpg"], keywords: "fuel cost calculator trip gas cost road trip mpg l/100km",
    title: "Trip Fuel Cost Calculator (L/100km or MPG)", description: "Work out how much fuel and money a road trip will take from distance, fuel economy and the fuel price you enter, and split it between passengers.",
    h1: "Trip fuel cost calculator", intro: "Plan the cost of a drive. Enter distance, fuel economy and your local fuel price.",
    howToTitle: "How to calculate trip fuel cost", steps: ["Pick metric (km, L/100 km) or US (miles, mpg).", "Enter the distance, your car's fuel use and the price per litre or gallon.", "Read the fuel needed and cost, and split it between people."],
    faq: [{ q: "How is fuel cost calculated?", a: "Metric: litres = distance × L/100 km ÷ 100. US: gallons = miles ÷ mpg. Cost = fuel × price." }, { q: "What fuel price should I use?", a: "The current price at the pump near you. The tool does not assume one." }, { q: "Is the result exact?", a: "No. Real consumption changes with speed, load, traffic and weather, so treat it as an estimate." }, PRIV],
    related: ["km-to-miles", "electricity-cost-calculator", "percentage-calculator", "basic-calculator"], crumb: "Fuel cost",
  }),
  m({
    slug: "electricity-cost-calculator", kind: "electricity", name: "Electricity cost calculator", short: "Cost to run any appliance from its watts, hours and your rate per kWh.", category: "Calculators",
    formats: ["kWh", "Cost"], keywords: "electricity cost calculator kwh appliance power usage watts cost to run",
    title: "Electricity Cost Calculator: Watts to Cost", description: "Estimate what a device costs to run per day, month and year from its watts, hours of use and your electricity price per kWh.",
    h1: "Electricity cost calculator", intro: "Find out what a heater, PC or fridge adds to your bill. You type your own rate, so it works anywhere.",
    howToTitle: "How to calculate electricity cost", steps: ["Enter the device power in watts (check the label).", "Enter the hours it runs per day.", "Enter your price per kWh from your bill and read the cost."],
    faq: [{ q: "What is a kWh?", a: "A kilowatt-hour is 1,000 watts used for one hour. A 100 W bulb on for 10 hours uses 1 kWh." }, { q: "Where do I find my rate?", a: "On your electricity bill, usually shown as price per kWh. Enter it in your own currency." }, { q: "Is the result exact?", a: "It is an estimate. Many devices draw less than their rated power or cycle on and off, and standby power adds a little." }, PRIV],
    related: ["fuel-cost-calculator", "percentage-calculator", "vat-calculator", "basic-calculator"], crumb: "Electricity cost",
  }),
  m({
    slug: "roman-numeral-converter", kind: "roman", name: "Roman numeral converter", short: "Convert numbers to Roman numerals and back, from 1 to 3999.", category: "Converters",
    formats: ["1–3999", "I V X"], keywords: "roman numeral converter number to roman numerals chart",
    title: "Roman Numeral Converter (1 to 3999)", description: "Convert numbers to Roman numerals and Roman numerals to numbers, from 1 to 3999, with the rules explained.",
    h1: "Roman numeral converter", intro: "Type a number to get its Roman numeral, or a Roman numeral to get the number.",
    howToTitle: "How to convert to Roman numerals", steps: ["Enter a number from 1 to 3999.", "Read the Roman numeral.", "To go the other way, type the numeral in the second box."],
    faq: [{ q: "What is 2024 in Roman numerals?", a: "MMXXIV: MM is 2000, XX is 20 and IV is 4." }, { q: "Why only up to 3999?", a: "Standard Roman numerals have no symbol above M (1000) and repeat a symbol at most three times, so 3999 (MMMCMXCIX) is the largest." }, { q: "Is there a zero?", a: "No. Classical Roman numerals had no symbol for zero." }, { q: "What does IIII mean?", a: "Some clock faces show 4 as IIII, but the standard form is IV, so the converter treats IIII as invalid." }],
    related: ["number-to-words", "basic-calculator", "fraction-calculator", "text-to-binary"], crumb: "Roman numerals",
  }),
  m({
    slug: "number-to-words", kind: "num-words", name: "Number to words converter", short: "Write any number in English words, including cheque style amounts.", category: "Converters",
    formats: ["1234 → words"], keywords: "number to words converter spell number cheque writing amount in words",
    title: "Number to Words Converter (Cheque Writing)", description: "Convert any number or amount to English words, for example 1234.56 to one thousand two hundred thirty-four point five six, or cheque style.",
    h1: "Number to words converter", intro: "Spell out a number in words for a cheque, contract or invoice.",
    howToTitle: "How to write a number in words", steps: ["Type the number, with or without commas or decimals.", "Read the words.", "Copy the cheque style version if you need \"and 56/100\"."],
    faq: [{ q: "How do I write 1,234.56 on a cheque?", a: "One thousand two hundred thirty-four and 56/100. The cheque style row shows that form." }, { q: "How large a number is supported?", a: "Up to just under one sextillion (21 digits) using US scales." }, { q: "Does it use British or American English?", a: "American scales (billion = 1,000,000,000) and no \"and\" after hundred. Add \"and\" yourself if your style guide asks for it." }, PRIV],
    related: ["roman-numeral-converter", "basic-calculator", "fraction-calculator", "percentage-calculator"],
  }),
];

// ---------- unit converters (pair pages + generic category pages) ----------
const num = (x: number) => (Math.abs(x) >= 1e9 || (x !== 0 && Math.abs(x) < 1e-4) ? x.toExponential(4) : String(+x.toPrecision(8)));
interface Conv { slug: string; cat: string; from: string; to: string; a: string; b: string; card?: boolean; ttl: string; related: string[] }
const conv = (c: Conv): ToolDef => {
  const set = UNIT_SETS[c.cat], A = set.units.find((u) => u.id === c.from)!, B = set.units.find((u) => u.id === c.to)!;
  const one = convertUnit(c.cat, 1, c.from, c.to), back = convertUnit(c.cat, 1, c.to, c.from);
  const temp = c.cat === "temperature";
  const formula = temp ? (c.from === "C" ? "multiply by 9/5 (1.8) and add 32: °F = °C × 9/5 + 32" : "subtract 32 and multiply by 5/9: °C = (°F − 32) × 5/9") : `multiply by ${num(one)}`;
  const sample = temp ? `${c.from === "C" ? "100 °C = 212 °F" : "212 °F = 100 °C"} and 0 °C = 32 °F` : `10 ${A.sym} = ${num(convertUnit(c.cat, 10, c.from, c.to))} ${B.sym}`;
  return {
    slug: c.slug, kind: "unit", card: !!c.card, name: `${c.a} to ${c.b}`, short: temp ? `Convert ${A.name} to ${B.name} with the exact formula.` : `Convert ${c.a} to ${c.b}. 1 ${A.sym} = ${num(one)} ${B.sym}.`, category: "Converters",
    formats: [A.sym, B.sym], keywords: `${c.a} to ${c.b} converter ${A.name} ${B.name} ${set.title.toLowerCase()} conversion`,
    title: T(c.ttl), description: temp ? `Convert ${A.name} to ${B.name} instantly with the exact formula, a quick reference table and the reverse conversion. Free and private.` : `Convert ${c.a} to ${c.b} instantly: 1 ${A.sym} = ${num(one)} ${B.sym}. Free converter with the formula and a quick-reference table.`,
    h1: `${c.a[0].toUpperCase()}${c.a.slice(1)} to ${c.b} converter`, intro: `Type a value in ${A.name.toLowerCase()} and get ${B.name.toLowerCase()} straight away. Swap the units any time to convert the other way.`,
    howToTitle: `How to convert ${c.a} to ${c.b}`, steps: [`Enter the value in ${A.name.toLowerCase()}.`, `Read the result in ${B.name.toLowerCase()}. It updates as you type.`, "Use Swap units to convert back, or change either unit for a different conversion."],
    faq: [
      { q: `How do I convert ${c.a} to ${c.b}?`, a: `To convert ${c.a} to ${c.b}, ${formula}. For example, ${sample}.` },
      { q: `How many ${c.b} are in 1 ${A.sym}?`, a: temp ? `Temperature scales are offset, so there is no single factor. Use the formula: ${formula}.` : `1 ${A.sym} equals ${num(one)} ${B.sym}.` },
      { q: `How do I convert ${c.b} back to ${c.a}?`, a: temp ? `Use the reverse formula: ${c.from === "C" ? "°C = (°F − 32) × 5/9" : "°F = °C × 9/5 + 32"}.` : `Multiply by ${num(back)}, because 1 ${B.sym} = ${num(back)} ${A.sym}.` },
      { q: "Is the conversion exact?", a: `It uses the internationally defined values and your browser's double-precision arithmetic. Results are shown to about 8 significant digits.` },
    ],
    related: c.related, crumb: `${c.a} to ${c.b}`, props: { cat: c.cat, from: c.from, to: c.to },
  };
};
interface Gen { slug: string; cat: string; from: string; to: string; name: string; ttl: string; desc: string; intro: string; kw: string; related: string[]; card?: boolean }
const gen = (g: Gen): ToolDef => ({
  slug: g.slug, kind: "unit", card: !!g.card, name: g.name, short: g.desc, category: "Converters", formats: UNIT_SETS[g.cat].units.slice(0, 4).map((u) => u.sym), keywords: g.kw,
  title: T(g.ttl), description: g.desc, h1: g.name, intro: g.intro, howToTitle: `How to use the ${g.name.toLowerCase()}`,
  steps: ["Type the value you want to convert.", "Choose the unit to convert from and the unit to convert to.", "Read the result, or press Swap units to go the other way."],
  faq: [
    { q: `Which units does the ${g.name.toLowerCase()} support?`, a: `${UNIT_SETS[g.cat].units.map((u) => u.name).join(", ")}.` },
    { q: "Is the conversion accurate?", a: "Yes. It uses the internationally defined conversion factors and shows results to about 10 significant digits." },
    { q: "Does it work offline?", a: "Once the page has loaded, conversions run in your browser with no network needed." },
    PRIV,
  ],
  related: g.related, crumb: g.name, props: { cat: g.cat, from: g.from, to: g.to },
});

const converters: ToolDef[] = [
  conv({ slug: "cm-to-inches", cat: "length", from: "cm", to: "in", a: "cm", b: "inches", card: true, ttl: "CM to Inches Converter (Free, Instant)", related: ["inches-to-cm", "feet-to-meters", "length-converter", "kg-to-lbs"] }),
  conv({ slug: "inches-to-cm", cat: "length", from: "in", to: "cm", a: "inches", b: "cm", ttl: "Inches to CM Converter (Free, Instant)", related: ["cm-to-inches", "feet-to-meters", "length-converter", "lbs-to-kg"] }),
  conv({ slug: "feet-to-meters", cat: "length", from: "ft", to: "m", a: "feet", b: "meters", ttl: "Feet to Meters Converter (Free, Instant)", related: ["cm-to-inches", "inches-to-cm", "km-to-miles", "length-converter"] }),
  conv({ slug: "km-to-miles", cat: "length", from: "km", to: "mi", a: "km", b: "miles", ttl: "KM to Miles Converter (Free, Instant)", related: ["feet-to-meters", "kmh-to-mph", "length-converter", "fuel-cost-calculator"] }),
  conv({ slug: "kg-to-lbs", cat: "weight", from: "kg", to: "lb", a: "kg", b: "pounds", card: true, ttl: "KG to Pounds (lbs) Converter, Free", related: ["lbs-to-kg", "weight-converter", "bmi-calculator", "calorie-calculator"] }),
  conv({ slug: "lbs-to-kg", cat: "weight", from: "lb", to: "kg", a: "pounds", b: "kg", ttl: "Pounds (lbs) to KG Converter, Free", related: ["kg-to-lbs", "weight-converter", "bmi-calculator", "cm-to-inches"] }),
  conv({ slug: "celsius-to-fahrenheit", cat: "temperature", from: "C", to: "F", a: "Celsius", b: "Fahrenheit", card: true, ttl: "Celsius to Fahrenheit Converter (°C to °F)", related: ["fahrenheit-to-celsius", "temperature-converter", "kg-to-lbs", "ml-to-cups"] }),
  conv({ slug: "fahrenheit-to-celsius", cat: "temperature", from: "F", to: "C", a: "Fahrenheit", b: "Celsius", ttl: "Fahrenheit to Celsius Converter (°F to °C)", related: ["celsius-to-fahrenheit", "temperature-converter", "kg-to-lbs", "ml-to-cups"] }),
  conv({ slug: "ml-to-cups", cat: "volume", from: "ml", to: "cup", a: "ml", b: "cups", ttl: "ML to Cups Converter (Plus Cups to Grams)", related: ["cooking-measurement-converter", "volume-converter", "celsius-to-fahrenheit", "kg-to-lbs"] }),
  conv({ slug: "square-meters-to-square-feet", cat: "area", from: "m2", to: "ft2", a: "square meters", b: "square feet", ttl: "Square Meters to Square Feet Converter", related: ["area-converter", "feet-to-meters", "cm-to-inches", "km-to-miles"] }),
  conv({ slug: "kmh-to-mph", cat: "speed", from: "kmh", to: "mph", a: "km/h", b: "mph", ttl: "KM/H to MPH Converter (Free, Instant)", related: ["speed-converter", "km-to-miles", "fuel-cost-calculator", "feet-to-meters"] }),
  conv({ slug: "mb-to-gb", cat: "data", from: "MB", to: "GB", a: "MB", b: "GB", ttl: "MB to GB Converter (Decimal & Binary)", related: ["data-size-converter", "compress-pdf-to-200kb", "resize-image-to-50kb", "image-compressor"] }),
  gen({ slug: "length-converter", cat: "length", from: "m", to: "ft", name: "Length converter", ttl: "Length Converter: m, cm, ft, in, km, miles", desc: "Convert between millimetres, centimetres, metres, kilometres, inches, feet, yards, miles and nautical miles.", intro: "Convert any length unit to any other, metric or imperial.", kw: "length converter metric imperial meters feet inches miles", related: ["cm-to-inches", "feet-to-meters", "km-to-miles", "area-converter"] }),
  gen({ slug: "weight-converter", cat: "weight", from: "kg", to: "lb", name: "Weight converter", ttl: "Weight Converter: kg, lb, oz, g, stone", desc: "Convert between milligrams, grams, kilograms, tonnes, ounces, pounds and stone.", intro: "Convert any weight or mass unit to another.", kw: "weight converter mass kg lbs oz grams stone", related: ["kg-to-lbs", "lbs-to-kg", "volume-converter", "bmi-calculator"] }),
  gen({ slug: "temperature-converter", cat: "temperature", from: "C", to: "F", name: "Temperature converter", ttl: "Temperature Converter: °C, °F and Kelvin", desc: "Convert between Celsius, Fahrenheit and Kelvin with exact formulas and a quick-reference table.", intro: "Convert Celsius, Fahrenheit and Kelvin in any direction.", kw: "temperature converter celsius fahrenheit kelvin", related: ["celsius-to-fahrenheit", "fahrenheit-to-celsius", "cooking-measurement-converter", "weight-converter"] }),
  gen({ slug: "volume-converter", cat: "volume", from: "l", to: "gal", name: "Volume converter", ttl: "Volume Converter: Litres, Gallons, Cups, ml", desc: "Convert between millilitres, litres, teaspoons, tablespoons, fluid ounces, cups, pints, quarts, gallons and cubic metres (US measures).", intro: "Convert liquid and cooking volumes, with a cups-to-grams helper for baking.", kw: "volume converter litres gallons cups ml fluid ounces", related: ["ml-to-cups", "cooking-measurement-converter", "weight-converter", "fuel-cost-calculator"] }),
  gen({ slug: "area-converter", cat: "area", from: "m2", to: "ft2", name: "Area converter", ttl: "Area Converter: m², ft², Acres, Hectares", desc: "Convert square metres, square feet, square yards, acres, hectares and more.", intro: "Convert land and floor area between metric and imperial units.", kw: "area converter square meters square feet acres hectares", related: ["square-meters-to-square-feet", "length-converter", "feet-to-meters", "km-to-miles"] }),
  gen({ slug: "speed-converter", cat: "speed", from: "kmh", to: "mph", name: "Speed converter", ttl: "Speed Converter: km/h, mph, m/s, Knots", desc: "Convert between km/h, mph, metres per second, knots and feet per second.", intro: "Convert vehicle, wind or boat speeds between units.", kw: "speed converter kmh mph knots m/s", related: ["kmh-to-mph", "km-to-miles", "length-converter", "fuel-cost-calculator"] }),
  gen({ slug: "data-size-converter", cat: "data", from: "GB", to: "MB", name: "Data size converter", ttl: "Data Size Converter: KB, MB, GB, TB, GiB", desc: "Convert between bits, bytes, KB, MB, GB, TB and the binary units KiB, MiB, GiB and TiB.", intro: "Convert file and storage sizes, in both decimal (1,000) and binary (1,024) units.", kw: "data size converter mb gb tb kib mib gib bytes", related: ["mb-to-gb", "compress-pdf-to-200kb", "resize-image-to-50kb", "image-compressor"] }),
  gen({ slug: "cooking-measurement-converter", cat: "volume", from: "cup", to: "ml", name: "Cooking measurement converter", ttl: "Cooking Converter: Cups, Tbsp, ml, Grams", desc: "Convert cups, tablespoons, teaspoons, ml and fluid ounces, plus cups to grams for flour, sugar, butter and more.", intro: "Convert recipe measurements, and turn cups into grams for common baking ingredients.", kw: "cooking measurement converter cups to grams tablespoons teaspoons ml baking", related: ["ml-to-cups", "volume-converter", "celsius-to-fahrenheit", "weight-converter"], card: true }),
];

export const CALC_TOOLS: ToolDef[] = [...calcs, ...converters];
