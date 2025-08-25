namespace Api.Options
{
    public sealed class MasterportalOptions
    {
        public string ServicesPath { get; set; } = string.Empty;
        public string ConfigPath { get; set; } = string.Empty;
        public string UploadedFolderTitle { get; set; } = "Uploaded_Geodata";
        public string ThemeConfigSection { get; set; } = "Fachdaten";
    }
}