# Sample Data for Examples

This directory should contain sample files for testing the capabilities of the Gemini API SDK.

## Required Files

The examples expect the following files to be present:

1. `sample.pdf` - A small PDF file (<20MB) for basic document processing
2. `sample2.pdf` - A second PDF file for the multiple document processing example
3. `sample.jpg` - An image file for image understanding examples
4. `sample.mp4` - A video file for video understanding examples
5. `sample.mp3` - An audio file for audio understanding examples

## Getting Sample Files

You can use any files you have access to, such as research papers, reports, documentation, images, videos, or audio files.

### PDF Samples
- Use public domain research papers from [arXiv](https://arxiv.org/)
- Download public PDF reports from government websites
- Use open-source software documentation

### Image Samples
- Use your own photos (without sensitive or private content)
- Use public domain images from [Unsplash](https://unsplash.com/) or [Pexels](https://www.pexels.com/)
- For image understanding tests, consider images with:
  - Multiple visible objects for object detection tests
  - Text content for OCR examples
  - Clear foreground objects for segmentation examples

### Video Samples
- Use your own short videos (without sensitive, private, or copyrighted content)
- Use public domain videos from [NASA](https://images.nasa.gov/)
- For video understanding tests, consider videos with:
  - Clear narration for transcription examples
  - Distinct scenes for scene analysis
  - Clear visual content for accurate analysis

### Audio Samples
- Use your own audio recordings (without sensitive, private, or copyrighted content)
- Use public domain audio from sources like [FreeSound](https://freesound.org/)
- For audio understanding tests, consider audio with:
  - Clear speech for transcription examples
  - Various speakers or sound effects for content analysis
  - A mix of music and speech for comprehensive testing

## File Size Considerations

- For inline data examples, files should be smaller than 20MB
- For the File API examples, files can be up to 50MB
- The Gemini API supports PDFs with up to 1000 pages
- For videos, longer content (>1 minute) should use the File API
- For audio, longer content (>5 minutes) should use the File API

## Supported Media Formats

### Image Formats
- PNG - image/png
- JPEG - image/jpeg
- WEBP - image/webp
- HEIC - image/heic
- HEIF - image/heif

### Video Formats
- MP4 - video/mp4
- MPEG - video/mpeg
- MOV - video/mov
- AVI - video/avi
- FLV - video/x-flv
- MPG - video/mpg
- WEBM - video/webm
- WMV - video/wmv
- 3GP - video/3gpp

### Audio Formats
- WAV - audio/wav
- MP3 - audio/mp3
- AIFF - audio/aiff
- AAC - audio/aac
- OGG - audio/ogg
- FLAC - audio/flac

## Privacy Note

Remember that any files you upload for these examples will be sent to Google's servers for processing. The files will be stored for 48 hours before being automatically deleted. Do not use files containing sensitive or private information for these examples. 