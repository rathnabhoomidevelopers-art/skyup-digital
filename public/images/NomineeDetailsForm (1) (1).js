import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const nomineeDetailsSchema = Yup.object({
    nomineename: Yup.string().required('Nominee Name is required'),
    nomineenumber:  Yup.string()
      .matches(
        /^(\+?[1-9]\d{0,3}|0)?[6-9]\d{9}$/,
        'Enter a valid contact number'
      ).required('Nominee Number is required'),
   nomineeage: Yup.number()
  .typeError('Nominee Age must be a number')
  .required('Nominee Age is required')
  .positive('Nominee Age must be positive')
  .integer('Nominee Age must be an integer')
  .max(999, 'Nominee Age must not exceed 3 digits'),
    nomineerelationship: Yup.string().required('Nominee Relationship is required'),
    nomineeaddress: Yup.string().required('Nominee Address is required'),
})


const NomineeDetailsForm = ({onNext,initialValues}) => {
    const handleSubmit = (values) => {
    console.log('Nominee Details:', values);
    onNext(values);
    };

    const defaultValues = initialValues || {
    nomineename: '',
    nomineenumber: '',
    nomineeage: '',
    nomineerelationship: '',
    nomineeaddress: '',
    }
  return (

   <div className="w-full">
         <Formik
           initialValues={defaultValues}
           validationSchema={nomineeDetailsSchema}
           onSubmit={handleSubmit}
           validateOnChange={true}
           validateOnBlur={true}
         >
           {({ errors, touched }) => (
             <Form>
               <div className="space-y-6 animate-fadeIn">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* Nominee Name */}
                     <div>
                                               <label className="block text-start text-sm font-semibold text-slate-700 mb-2">
                                                Nominee Name <span className="text-red-500">*</span>
                                               </label>
                                               <Field
                                                 name="nomineename"
                                                 type="text"
                                                 placeholder=""
                                                 className={`w-full px-4 py-3 rounded-lg border-2 bg-[#FFFFFF]  border-[#D2D5DA] transition-all duration-200 ${
                                                   errors.nomineename && touched.nomineename
                                                     ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                                                     : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
                                                 } outline-none`}
                                               />
                                               <ErrorMessage name="nomineename" component="div" className="text-red-500 text-sm mt-1 font-medium" />
                                             </div>
                        {/* Nominee Number */}
                        <div>
                                                  <label className="block text-start text-sm font-semibold text-slate-700 mb-2">
                                                    Nominee Number <span className="text-red-500">*</span>
                                                  </label>
                                                  <Field
                                                    name="nomineenumber"
                                                    type="text"
                                                    placeholder=""
                                                    className={`w-full px-4 py-3 rounded-lg border-2  bg-[#FFFFFF]  border-[#D2D5DA] transition-all duration-200 ${
                                                      errors.nomineenumber && touched.nomineenumber
                                                        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                                                        : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
                                                    } outline-none`}
                                                  />
                                                  <ErrorMessage name="nomineenumber" component="div" className="text-red-500 text-sm mt-1 font-medium" />
                                                </div>
                    {/* Nominee Age */}
                     <div>
                                                  <label className="block text-start text-sm font-semibold text-slate-700 mb-2">
                                                    Nominee Age <span className="text-red-500">*</span>
                                                  </label>
                                                  <Field
                                                    name="nomineeage"
                                                    type="text"
                                                    placeholder=""
                                                    className={`w-full px-4 py-3 rounded-lg border-2  bg-[#FFFFFF]  border-[#D2D5DA] transition-all duration-200 ${
                                                      errors.nomineeage && touched.nomineeage
                                                        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                                                        : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
                                                    } outline-none`}
                                                  />
                                                  <ErrorMessage name="nomineeage" component="div" className="text-red-500 text-sm mt-1 font-medium" />
                                                </div>
                    {/* Nominee Relation */}
                     <div>
                                               <label className="block text-start text-sm font-semibold text-slate-700 mb-2">
                                                Nominee Relation <span className="text-red-500">*</span>
                                               </label>
                                               <Field
                                                 name="nomineerelationship"
                                                 type="text"
                                                 placeholder=""
                                                 className={`w-full px-4 py-3 rounded-lg border-2 bg-[#FFFFFF]  border-[#D2D5DA] transition-all duration-200 ${
                                                   errors.nomineerelationship && touched.nomineerelationship
                                                     ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                                                     : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
                                                 } outline-none`}
                                               />
                                               <ErrorMessage name="nomineerelationship" component="div" className="text-red-500 text-sm mt-1 font-medium" />
                                             </div>
                    {/* Nominee Address */}
                    <div>
                                      <label className="block text-start text-sm font-semibold text-slate-700 mb-2">
                                        Nominee Address <span className="text-red-500">*</span>
                                      </label>
                                      <Field
                                        name="nomineeaddress"
                                        type="text"
                                        placeholder=""
                                        className={`w-full px-4 py-3 rounded-lg border-2 bg-[#FFFFFF]  border-[#D2D5DA] transition-all duration-200 ${
                                          errors.nomineeaddress && touched.nomineeaddress
                                            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                                            : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
                                        } outline-none`}
                                      />
                                      <ErrorMessage name="nomineeaddress" component="div" className="text-red-500 text-sm mt-1 font-medium" />
                                    </div>
                                    </div>
                                    </div>

                                     {/* Navigation Buttons */}
                                                <div className="flex justify-end mt-8 pt-6 border-t border-slate-200">
                                                  
                                                  <button
                                                    type="submit"
                                                    className="px-14 py-3 bg-gradient-to-r from-[#ffff00] via-[#7158b6] to-[#7158b6] text-[#FFFFFF] font-bold fs-16px font-Poppins rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                                  >
                                                    Finish
                                                  </button>
                                                </div>
                                              </Form>
                                            )}
                                          </Formik>
                                        </div>
                    


  )
}

export default NomineeDetailsForm
