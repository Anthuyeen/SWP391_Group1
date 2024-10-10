namespace BE.Service.ImplService
{
    // Services/CloudinaryService.cs
    using CloudinaryDotNet;
    using CloudinaryDotNet.Actions;
    using Microsoft.Extensions.Options;
    using System.Threading.Tasks;

    public class CloudinaryService
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryService(IOptions<CloudinarySettings> config)
        {
            var account = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(account);
        }

        public async Task<ImageUploadResult> UploadImageAsync(string filePath)
        {
            var uniquePublicId = Guid.NewGuid().ToString(); // Generate a unique ID
            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(filePath),
                PublicId = uniquePublicId,
                Overwrite = true // Optional: Ensure it doesn't overwrite existing images with the same public ID
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);
            return uploadResult;
        }
    }

    // Models/CloudinarySettings.cs
    public class CloudinarySettings
    {
        public string CloudName { get; set; }
        public string ApiKey { get; set; }
        public string ApiSecret { get; set; }
    }

}

