document.addEventListener('DOMContentLoaded', () => {
  const downloadLinks = document.querySelectorAll('[data-document-pdf-download]');

  if (!downloadLinks.length) {
    return;
  }

  const imageWidth = 1600;
  const pageWidth = 612;
  const pageHeight = 792;
  const pageMargin = 24;

  const buildIiifImageUrl = (serviceId) => {
    if (!serviceId) return null;
    return `${serviceId.replace(/\/$/, '')}/full/${imageWidth},/0/default.jpg`;
  };

  const getManifestImages = (manifest) => {
    if (manifest.items) {
      return manifest.items
        .map((canvas) => {
          const body = canvas.items?.[0]?.items?.[0]?.body;
          const service = Array.isArray(body?.service) ? body.service[0] : body?.service;
          return buildIiifImageUrl(service?.id || service?.['@id']) || body?.id;
        })
        .filter(Boolean);
    }

    return (manifest.sequences?.[0]?.canvases || [])
      .map((canvas) => {
        const resource = canvas.images?.[0]?.resource;
        const service = resource?.service;
        return buildIiifImageUrl(service?.id || service?.['@id']) || resource?.id || resource?.['@id'];
      })
      .filter(Boolean);
  };

  const blobToDataUrl = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  const getImageSize = (dataUrl) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
      image.onerror = reject;
      image.src = dataUrl;
    });

  const setLinkState = (link, label, busy) => {
    link.textContent = label;
    link.setAttribute('aria-busy', busy ? 'true' : 'false');
    link.classList.toggle('opacity-70', busy);
    link.classList.toggle('pointer-events-none', busy);
  };

  const addImagePage = async (pdf, imageUrl, index) => {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Could not fetch image ${index + 1}`);
    }

    const blob = await response.blob();
    const dataUrl = await blobToDataUrl(blob);
    const size = await getImageSize(dataUrl);
    const availableWidth = pageWidth - pageMargin * 2;
    const availableHeight = pageHeight - pageMargin * 2;
    const scale = Math.min(availableWidth / size.width, availableHeight / size.height);
    const width = size.width * scale;
    const height = size.height * scale;
    const x = (pageWidth - width) / 2;
    const y = (pageHeight - height) / 2;

    if (index > 0) {
      pdf.addPage([pageWidth, pageHeight], 'portrait');
    }

    pdf.addImage(dataUrl, 'JPEG', x, y, width, height, undefined, 'FAST');
  };

  const downloadDocumentPdf = async (link) => {
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) {
      window.location.href = link.href;
      return;
    }

    const originalLabel = link.textContent.trim();
    const manifestUrl = link.dataset.manifestUrl;
    const filename = link.dataset.pdfFilename || 'document.pdf';
    const title = link.dataset.documentTitle || filename.replace(/\.pdf$/i, '');

    try {
      setLinkState(link, 'Preparing PDF...', true);
      const manifestResponse = await fetch(manifestUrl);
      if (!manifestResponse.ok) {
        throw new Error('Could not fetch IIIF manifest');
      }

      const manifest = await manifestResponse.json();
      const images = getManifestImages(manifest);
      if (!images.length) {
        throw new Error('No IIIF images found');
      }

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: [pageWidth, pageHeight],
        compress: true
      });

      pdf.setProperties({ title });

      for (const [index, imageUrl] of images.entries()) {
        setLinkState(link, `Preparing PDF ${index + 1}/${images.length}`, true);
        await addImagePage(pdf, imageUrl, index);
      }

      pdf.save(filename);
    } catch (error) {
      console.error(error);
      window.location.href = link.href;
    } finally {
      setLinkState(link, originalLabel, false);
    }
  };

  downloadLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      downloadDocumentPdf(link);
    });
  });
});
