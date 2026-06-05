export const TRANSLATIONS = {
  appTitle: 'Frame It',
  appSubtitle: 'Frame your photos with customized templates for Instagram and WhatsApp status/story!',
  userZone: 'Create Frame',
  adminZone: 'Settings',
  adminTitle: 'Template Manager',
  adminSubtitle: 'Configure and install transparent PNG overlay templates for WhatsApp and Instagram',
  
  // User Workspace
  photoUploadTitle: 'Drag & Drop your photo here',
  uploadPrompt: 'Click anywhere to import a high-res JPG/PNG image',
  uploadHelp: 'Supports standard phone camera pictures and portraits',
  changePhoto: 'Choose custom photo',
  
  // Controls
  controlsHeading: 'Photo Fit & Transformation',
  zoom: 'Scale Factor',
  rotate: 'Clockwise Rotation',
  resetAdjustments: 'Reset Transform',
  
  // Frame Selection
  selectFrame: 'Select Framing Template Overlay',
  aspectRatio: 'Output Style Ratio',
  
  // Save Action
  downloadBtn: 'Download Framed Photo',
  downloading: 'Rendering framed photo...',
  downloadSuccess: 'Image saved directory successfully!',
  downloadError: 'Could not process and download image. Try resetting placement.',
  noPhotoError: 'Kindly select a photo first!',
  
  // Admin interface
  createNewFrame: 'Register New Overlay',
  frameNameEn: 'Overlay Name',
  frameType: 'Frame Aspect Format',
  
  // Image Frame Upload Options
  framePngUpload: 'Transparent PNG border file',
  framePngHelp: 'Requirement: File must be a transparent PNG with a cutout so your photo sits perfectly underneath.',
  previewFrame: 'Live Frame Asset Preview',
  
  // Actions
  saveFrame: 'Save Frame Overlay',
  cancel: 'Cancel',
  deleteFrame: 'Delete Frame',
  defaultTag: 'System Preset',
  customTag: 'User Preset',
  confirmDelete: 'Are you sure you want to delete this custom template?',
  noCustomFrames: 'No custom templates have been registered.',
  addYourOwnFramePrompt: 'To add brand new border layers, open settings at the top right.',
  
  // Toast
  toastFrameSaved: 'Custom template registered successfully!',
  toastFrameDeleted: 'Custom template deleted.',
  toastPhotoLoaded: 'Photo imported successfully!'
};
export type AppTranslation = typeof TRANSLATIONS;
